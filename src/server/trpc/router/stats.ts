import { protectedProcedure } from './../trpc';
import { router } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const statsRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
        selfOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end, selfOnly } = input;
      const corpsId = ctx.session.user.corps.id;
      const nbrOfGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where: {
          date: { gte: start, lte: end },
        },
      });

      const positivelyCountedGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where: {
          date: { gte: start, lte: end },
          countsPositively: true,
        },
      });

      interface CorpsStats {
        id: string;
        number: number | null;
        firstName: string;
        lastName: string;
        gigsAttended: number;
        maxPossibleGigs: number;
        attendence: number;
      }

      const corpsStatsQuery = ctx.prisma.$queryRaw<CorpsStats[]>`
        SELECT 
          Corps.id as id,
          number,
          firstName,
          lastName, 
          SUM(CASE WHEN attended THEN points ELSE 0 END) AS gigsAttended,
          SUM(
            CASE WHEN NOT COALESCE(attended, false) AND Gig.countsPositively = 1
              THEN 0
              ELSE points
            END
          ) AS maxPossibleGigs
        FROM Gig
        CROSS JOIN Corps
        LEFT JOIN GigSignup ON gigId = Gig.id AND corpsId = Corps.id
        WHERE Gig.date BETWEEN ${start} AND ${end}
        AND (Corps.id = ${corpsId} OR ${!selfOnly})
        GROUP BY Corps.id
        HAVING gigsAttended > 0 OR ${selfOnly}
        ORDER BY 
          gigsAttended DESC,
          ISNULL(number), number,
          lastName,
          firstName;
      `;

      const [nbrOfGigs, positivelyCountedGigs, corpsStats] =
        await ctx.prisma.$transaction([
          nbrOfGigsQuery,
          positivelyCountedGigsQuery,
          corpsStatsQuery,
        ]);

      return {
        corpsIds: corpsStats.map((corps) => corps.id),
        nbrOfGigs: nbrOfGigs._sum.points ?? 0,
        positivelyCountedGigs: positivelyCountedGigs._sum.points ?? 0,
        corpsStats: corpsStats.reduce((acc, corps) => {
          acc[corps.id] = {
            ...corps,
            attendence:
              corps.maxPossibleGigs === 0
                ? 1.0
                : corps.gigsAttended / corps.maxPossibleGigs,
          };
          return acc;
        }, {} as Record<string, CorpsStats>),
      };
    }),

  getManyPoints: protectedProcedure
    .input(z.object({ corpsIds: z.array(z.string()).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { corpsIds } = input ?? {};
      if (!corpsIds || corpsIds.length === 0) {
        return {
          points: {},
          corpsIds: [],
        };
      }
      type Entry = { corpsId: string; points: number };
      const pointsQuery = await ctx.prisma.$queryRaw<Entry[]>`
        SELECT corpsId, SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND (${corpsIds.length === 0} OR corpsId IN (${Prisma.join(corpsIds)}))
        GROUP BY corpsId
      `;
      const points = pointsQuery.reduce((acc, { corpsId, points }) => {
        acc[corpsId] = points;
        return acc;
      }, {} as Record<string, number>);
      return {
        points,
        corpsIds: Object.keys(points),
      };
    }),

  getCorpsBuddy: protectedProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const corpsId = ctx.session.user.corps.id;
      type Entry = {
        corpsId: string;
        firstName: string;
        lastName: string;
        number: number | null;
        commonGigs: number;
        similarity: number;
      };
      const result = await ctx.prisma.$queryRaw<Entry[]>`
        WITH attendedGigs AS (
          SELECT corpsId, sum(points) AS points
          FROM GigSignup
          JOIN Gig ON Gig.id = GigSignup.gigId
          WHERE attended = true
          ${start ? Prisma.sql`AND date >= ${start}` : Prisma.empty}
          ${end ? Prisma.sql`AND date <= ${end}` : Prisma.empty}
          GROUP BY corpsId
        )
        SELECT
          GigSignup.corpsId AS corpsId,
          number,
          firstName,
          lastName,
          SUM(Gig.points) AS commonGigs,
          SUM(Gig.points) / (attendedGigs.points + (SELECT points FROM attendedGigs WHERE corpsId = ${corpsId} LIMIT 1) - SUM(Gig.points)) AS similarity
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        JOIN Corps ON Corps.id = GigSignup.corpsId
        JOIN attendedGigs ON attendedGigs.corpsId = GigSignup.corpsId
        WHERE gigId IN (
          SELECT gigId
          FROM GigSignup
          WHERE corpsId = ${corpsId}
          AND attended = true
        )
        AND GigSignup.corpsId != ${corpsId}
        AND attended = true
        ${start ? Prisma.sql`AND date >= ${start}` : Prisma.empty}
        ${end ? Prisma.sql`AND date <= ${end}` : Prisma.empty}
        GROUP BY GigSignup.corpsId
        ORDER BY similarity DESC
      `;
      return {
        corpsBuddy: result[0],
        corpsEnemy: result[result.length - 1],
      };
    }),

  getMonthly: protectedProcedure
    .input(
      z
        .object({
          start: z.date().optional(),
          end: z.date().optional(),
          corpsId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const ownCorpsId = ctx.session.user.corps.id;
      const { start, end, corpsId = ownCorpsId } = input ?? {};
      type Entry = {
        month: string;
        points: string;
      };
      type MaxGigsEntry = {
        month: string;
        maxGigs: string;
      };
      const monthlyDataQuery = ctx.prisma.$queryRaw<Entry[]>`
        SELECT
          DATE_FORMAT(date, '%Y-%m-01') AS month,
          SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND corpsId = ${corpsId}
        ${start ? Prisma.sql`AND date >= ${start}` : Prisma.empty}
        ${end ? Prisma.sql`AND date <= ${end}` : Prisma.empty}
        GROUP BY month
        ORDER BY month
      `;
      const monthlyMaxGigsQuery = ctx.prisma.$queryRaw<MaxGigsEntry[]>`
        SELECT
          DATE_FORMAT(date, '%Y-%m-01') AS month,
          SUM(points) AS maxGigs
          FROM Gig
          WHERE 1 = 1
          ${start ? Prisma.sql`AND date >= ${start}` : Prisma.empty}
          ${end ? Prisma.sql`AND date <= ${end}` : Prisma.empty}
          GROUP BY month
      `;

      const [monthlyData, monthlyMaxGigs] = await ctx.prisma.$transaction([
        monthlyDataQuery,
        monthlyMaxGigsQuery,
      ]);
      console.log(typeof monthlyMaxGigs[0]?.month);
      const monthlyDataMap = monthlyData.reduce((acc, { month, points }) => {
        acc[new Date(month).toISOString()] = parseInt(points);
        return acc;
      }, {} as Record<string, number>);

      const startMonth = new Date(monthlyData[0]?.month ?? new Date());
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return monthlyMaxGigs
        .filter(
          ({ month }) =>
            startMonth <= new Date(month) && new Date(month) <= currentDate,
        )
        .map(({ month, maxGigs }) => ({
          points: monthlyDataMap[new Date(month).toISOString()] ?? 0,
          month: new Date(month),
          maxGigs: parseInt(maxGigs),
        }));
    }),

  getCareer: protectedProcedure
    .input(
      z
        .object({
          corpsId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const ownCorpsId = ctx.session.user.corps.id;
      const { corpsId = ownCorpsId } = input ?? {};
      const joinedQuery = ctx.prisma.corpsRehearsal.findFirst({
        select: {
          rehearsal: {
            select: {
              date: true,
            },
          },
        },
        where: {
          corpsId,
        },
        orderBy: {
          rehearsal: {
            date: 'asc',
          },
        },
      });

      const pointsQuery = ctx.prisma.gig.aggregate({
        _sum: {
          points: true,
        },
        where: {
          signups: {
            some: {
              corpsId,
              attended: true,
            },
          },
        },
      });

      const rehearsalsQuery = ctx.prisma.corpsRehearsal.count({
        where: {
          corpsId,
        },
      });

      const [joined, points, rehearsals] = await ctx.prisma.$transaction([
        joinedQuery,
        pointsQuery,
        rehearsalsQuery,
      ]);

      return {
        joined: joined?.rehearsal.date ?? new Date(),
        points: points._sum.points ?? 0,
        rehearsals,
      };
    }),

  getPentagon: protectedProcedure
    .input(
      z
        .object({
          corpsId: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const ownCorpsId = ctx.session.user.corps.id;
      const { corpsId = ownCorpsId, limit = 20 } = input ?? {};

      const recentGigsQuery = ctx.prisma.gig.findMany({
        include: {
          signups: {
            where: {
              corpsId,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
      });

      const recentlySignedGigsQuery = ctx.prisma.gig.findMany({
        include: {
          signups: {
            where: {
              corpsId,
            },
          },
        },
        where: {
          signups: {
            some: {
              corpsId,
              status: {
                value: 'Ja',
              },
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
      });

      const recentlyAttendedGigsQuery = ctx.prisma.gig.findMany({
        include: {
          signups: {
            where: {
              corpsId,
            },
          },
        },
        where: {
          signups: {
            some: {
              corpsId,
              attended: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
      });

      const [recent, recentlySigned, recentlyAttended] =
        await ctx.prisma.$transaction([
          recentGigsQuery,
          recentlySignedGigsQuery,
          recentlyAttendedGigsQuery,
        ]);

      let totalSignupDelay = 0;
      for (const gig of recentlySigned) {
        const signup = gig.signups[0];
        if (!signup) {
          continue;
        }
        totalSignupDelay += Math.trunc(
          (signup?.createdAt.getTime() - gig.createdAt.getTime()) /
            1000 /
            60 /
            60,
        );
      }

      return null;
    }),
});
