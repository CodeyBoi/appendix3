import { protectedProcedure } from "./../trpc";
import { router } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const statsRouter = router({
  getYearly: protectedProcedure
    .input(
      z.object({ operatingYear: z.number(), selfOnly: z.boolean().optional() })
    )
    .query(async ({ ctx, input }) => {
      const { operatingYear, selfOnly } = input;
      const statsStart = new Date(operatingYear, 8, 1); // September 1st
      const currentDate = new Date();
      const operatingYearEnd = new Date(operatingYear + 1, 7, 31); // August 31st next year
      // If we're in the same year, we want to show the stats up to today
      const statsEnd = currentDate < operatingYearEnd ? currentDate : operatingYearEnd;
      const corpsId = ctx.session.user.corps.id;
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
        WHERE Gig.date BETWEEN ${statsStart} AND ${statsEnd}
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
    .query(async ({ ctx }) => {
      const corpsId = ctx.session.user.corps.id;
      type Entry = {
        firstName: string;
        lastName: string;
        number: number | null;
        points: number;
      };
      const result = await ctx.prisma.$queryRaw<Entry[]>`
        SELECT
          number,
          firstName,
          lastName,
          SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        JOIN Corps ON Corps.id = GigSignup.corpsId
        WHERE gigId IN (
          SELECT gigId
          FROM GigSignup
          WHERE corpsId = ${corpsId}
          AND attended = true
        )
        AND corpsId != ${corpsId}
        AND attended = true
        GROUP BY corpsId
        ORDER BY points DESC
        LIMIT 1
      `;
      return result[0];
    }),

});
