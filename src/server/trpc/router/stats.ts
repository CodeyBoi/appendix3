import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const statsRouter = router({
  yearly: publicProcedure
    .input(z.object({ operatingYear: z.number() }))
    .query(async ({ ctx, input }) => {
      const { operatingYear } = input;
      const statsStart = new Date(operatingYear, 8, 1);     // September 1st
      const statsEnd = new Date(operatingYear + 1, 7, 31);  // August 31st next year

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
        }
      });

      interface CorpsStats {
        id: number;
        number: number;
        firstName: string;
        lastName: string;
        gigsAttended: number;
        maxPossibleGigs: number;
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
        GROUP BY Corps.id
        ORDER BY 
          gigsAttended DESC,
          ISNULL(number), number,
          lastName,
          firstName;
      `;

      const [nbrOfGigs, positivelyCountedGigs, corpsStats] =
        await ctx.prisma.$transaction([nbrOfGigsQuery, positivelyCountedGigsQuery, corpsStatsQuery]);

      return {
        nbrOfGigs: nbrOfGigs._sum.points ?? 0,
        positivelyCountedGigs: positivelyCountedGigs._sum.points ?? 0,
        corpsStats: corpsStats.map(corps => {
          const gigsAttended = Number(corps.gigsAttended ?? 0);
          const maxPossibleGigs = Number(corps.maxPossibleGigs ?? 0);
          return {
            ...corps,
            gigsAttended,
            maxPossibleGigs,
            attendence: maxPossibleGigs === 0 ? 1.0 : gigsAttended / maxPossibleGigs,
          };
        }).filter(corps => corps.gigsAttended > 0),
      };
    }),
});
