import { protectedProcedure } from './../trpc';
import { router } from '../trpc';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const statsRouter = router({
  getYearly: protectedProcedure
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
      const corpsIds = input?.corpsIds ?? [];
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
});
