import { protectedProcedure } from './../trpc';
import { router } from "../trpc";
import { z } from "zod";
import { Prisma } from '@prisma/client';

export const statsRouter = router({
  getYearly: protectedProcedure
    .input(
      z.object({ operatingYear: z.number(), selfOnly: z.boolean().optional() })
    )
    .query(async ({ ctx, input }) => {
      const { operatingYear, selfOnly } = input;
      const statsStart = new Date(operatingYear, 8, 1); // September 1st
      const statsEnd = new Date(operatingYear + 1, 7, 31); // August 31st next year
      const corpsId = ctx.session?.user?.corps?.id;

      const nbrOfGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where: {
          date: { gte: statsStart, lte: statsEnd },
        },
      });

      const positivelyCountedGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where: {
          date: { gte: statsStart, lte: statsEnd },
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
      }

      const corpsStatsQuery = corpsId && selfOnly
        ? ctx.prisma.$queryRaw<CorpsStats[]>`
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
      WHERE Gig.date BETWEEN ${statsStart} AND ${statsEnd}
      AND Corps.id = ${corpsId}
      ORDER BY 
        gigsAttended DESC,
        ISNULL(number), number,
        lastName,
        firstName;
    `
        : ctx.prisma.$queryRaw<CorpsStats[]>`
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
        WHERE Gig.date BETWEEN ${statsStart} AND ${statsEnd}
        GROUP BY Corps.id
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
        nbrOfGigs: nbrOfGigs._sum.points ?? 0,
        positivelyCountedGigs: positivelyCountedGigs._sum.points ?? 0,
        corpsStats: corpsStats
          .map((corps) => {
            const gigsAttended = Number(corps.gigsAttended ?? 0);
            const maxPossibleGigs = Number(corps.maxPossibleGigs ?? 0);
            return {
              ...corps,
              gigsAttended,
              maxPossibleGigs,
              attendence:
                maxPossibleGigs === 0 ? 1.0 : gigsAttended / maxPossibleGigs,
            };
          })
          .filter((corps) => corps.gigsAttended > 0),
      };
    }),

  getPoints: protectedProcedure
    .input(z.object({ corpsId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const corpsId = input.corpsId ?? ctx.session.user.corps.id;
      const pointsQuery = await ctx.prisma.$queryRaw<{ points: number }[]>`
        SELECT SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND corpsId = ${corpsId}
      `;
      return pointsQuery?.[0]?.points ?? 0;
    }),

  getManyPoints: protectedProcedure
    .input(z.object({ corpsIds: z.array(z.string()).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const corpsIds = input?.corpsIds ?? [];
      console.log(corpsIds);
      
      const pointsQuery = await ctx.prisma.$queryRaw<{ corpsId: string, points: number }[]>`
        SELECT corpsId, SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND corpsId IN (${Prisma.join(corpsIds)})
        GROUP BY corpsId
      `;
      const result = pointsQuery.reduce((acc, { corpsId, points }) => {
        acc[corpsId] = points;
        return acc;
      }, {} as Record<string, number>);
      console.log(result);
      
      return result;
    }),
});
