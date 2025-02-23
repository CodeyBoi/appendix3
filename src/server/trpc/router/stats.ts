import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { router } from '../trpc';
import { protectedProcedure } from './../trpc';
import { calcOperatingYearInterval, getOperatingYear } from 'utils/date';
import dayjs from 'dayjs';
import { toMap } from 'utils/array';

export const statsRouter = router({
  getMany: protectedProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
        selfOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        start,
        end = dayjs().add(1, 'year').toDate(),
        selfOnly = false,
      } = input;
      const corpsId = ctx.session.user.corps.id;

      const where = {
        date: { gte: start, lte: end },
        signups: { some: { attended: true } },
        points: { gt: 0 },
      };

      const nbrOfGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where,
      });

      const positivelyCountedGigsQuery = ctx.prisma.gig.aggregate({
        _sum: { points: true },
        where: {
          ...where,
          countsPositively: true,
        },
      });

      interface CorpsStats {
        id: string;
        number: number | null;
        firstName: string;
        lastName: string;
        nickName: string | null;
        gigsAttended: number;
        positiveGigsAttended: number;
        maxPossibleGigs: number;
      }

      const corpsStatsQuery = ctx.prisma.$queryRaw<CorpsStats[]>`
        SELECT
          Corps.id as id,
          number,
          firstName,
          lastName,
          nickName,
          SUM(CASE WHEN attended THEN points ELSE 0 END) AS gigsAttended,
          SUM(CASE WHEN attended AND Gig.countsPositively THEN points ELSE 0 END) AS positiveGigsAttended,
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
        AND points > 0
        AND EXISTS (
          SELECT *
          FROM GigSignup
          WHERE gigId = Gig.id
          AND attended
        )
        AND (Corps.id = ${corpsId} OR ${!selfOnly})
        GROUP BY Corps.id
        HAVING gigsAttended > 0 OR ${selfOnly}
        ORDER BY
          gigsAttended DESC,
          ISNULL(number), number,
          lastName,
          firstName;
      `;

      const res = await ctx.prisma.$transaction([
        nbrOfGigsQuery,
        positivelyCountedGigsQuery,
        corpsStatsQuery,
      ]);
      const totalGigs = res[0]._sum.points ?? 0;
      const positivelyCountedGigs = res[1]._sum.points ?? 0;
      const corpsIds = res[2].map((corps) => corps.id);

      const corpsStats = toMap(
        res[2],
        (s) => s.id,
        (corps) => {
          const fullName = `${corps.firstName} ${corps.lastName}`;
          return {
            ...corps,
            fullName,
            displayName: corps.nickName ?? fullName,
            attendance:
              corps.maxPossibleGigs === 0
                ? 1.0
                : corps.gigsAttended / corps.maxPossibleGigs,
          };
        },
      );

      corpsIds.sort(
        (a, b) =>
          (corpsStats.get(b)?.attendance ?? 0) -
          (corpsStats.get(a)?.attendance ?? 0),
      );

      const ret = {
        corpsIds,
        totalGigs,
        ordinaryGigs: totalGigs - positivelyCountedGigs,
        positivelyCountedGigs,
        corpsStats,
      };

      return ret;
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
      interface Entry {
        corpsId: string;
        points: number;
      }
      const pointsQuery = await ctx.prisma.$queryRaw<Entry[]>`
        SELECT corpsId, SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND (${corpsIds.length === 0} OR corpsId IN (${Prisma.join(corpsIds)}))
        GROUP BY corpsId
      `;
      const points = pointsQuery.reduce<Record<string, number>>(
        (acc, { corpsId, points }) => {
          acc[corpsId] = points;
          return acc;
        },
        {},
      );
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
      interface Entry {
        corpsId: string;
        firstName: string;
        lastName: string;
        number: number | null;
        commonGigs: number;
        similarity: number;
      }
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
      interface Entry {
        month: string;
        points: string;
      }
      interface MaxGigsEntry {
        month: string;
        maxGigs: string;
      }
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
      const monthlyDataMap = monthlyData.reduce<Record<string, number>>(
        (acc, { month, points }) => {
          acc[new Date(month).toISOString()] = parseInt(points);
          return acc;
        },
        {},
      );

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
      const { corpsId = ownCorpsId, limit = 29 } = input ?? {};

      const currentDate = new Date();

      const recentGigsQuery = ctx.prisma.gig.findMany({
        where: {
          date: {
            lte: currentDate,
          },
          points: {
            gt: 0,
          },
        },
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
          date: {
            lte: currentDate,
          },
          points: {
            gt: 0,
          },
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
      });

      const [recent, recentlySigned] = await ctx.prisma.$transaction([
        recentGigsQuery,
        recentlySignedGigsQuery,
      ]);

      // Calculate attack: How few days a corps waits on average to sign up for a gig
      let totalSignupDelay = 0;
      for (const gig of recentlySigned) {
        const signup = gig.signups[0];
        if (!signup) {
          continue;
        }
        totalSignupDelay += Math.trunc(
          (signup.createdAt.getTime() - gig.createdAt.getTime()) /
            1000 /
            60 /
            60 /
            24,
        );
      }
      const avgSignupDelay = totalSignupDelay / recentlySigned.length;
      const attack =
        avgSignupDelay === 0 ? 10 : 5 / Math.log(avgSignupDelay + 1.65);

      // Calculate strength (styrka): How hard the corps is carrying its section
      // TODO: Implement this

      // Calculate endurance (uthållighet): How many gigs the corps has attended in a row
      let longestStreak = 0;
      let currentStreak = 0;
      for (const gig of recent) {
        const signup = gig.signups[0];
        if (!signup?.attended) {
          currentStreak = 0;
          continue;
        }
        currentStreak++;
        longestStreak =
          longestStreak > currentStreak ? longestStreak : currentStreak;
      }
      const endurance = (longestStreak / recent.length) * 10;

      // Calculate hype (tagg): How many of the recent gigs the corps has attended
      let attended = 0;
      for (const gig of recent) {
        const signup = gig.signups[0];
        if (signup?.attended) {
          attended++;
        }
      }
      const hype = (attended / recent.length) * 10;

      // Calculate reliablity (pålitlighet): How late after their initial signup a corps changes their status
      attended = 0;
      let delta = 0;
      for (const gig of recentlySigned) {
        const signup = gig.signups[0];
        if (!signup) {
          continue;
        }
        delta += signup.updatedAt.getTime() - signup.createdAt.getTime();
      }
      delta /= recentlySigned.length;
      const deltaDays = delta / 1000 / 60 / 60 / 24;
      const reliability = 10 * Math.exp(-deltaDays / 2);

      return {
        attack,
        avgSignupDelay,
        strength: (attack + endurance + hype + reliability) / 4,
        endurance,
        longestStreak,
        hype,
        reliability,
        avgSignupChange: deltaDays,
      };
    }),

  getPreliminaryMembers: protectedProcedure.query(async ({ ctx }) => {
    const gigLimit = 50;
    const rehearsalLimit = 25;

    // This cannot be null as we know we have atleast one member in Bleckhornen
    const currentMaxNumber = (
      await ctx.prisma.corps.aggregate({
        _max: {
          number: true,
        },
      })
    )._max.number;

    if (!currentMaxNumber) {
      return [];
    }

    interface CorpsGigs {
      id: string;
      number: number | null;
      firstName: string;
      lastName: string;
      gigsAttended: number;
    }

    const gigLists = await ctx.prisma.$queryRaw<CorpsGigs[]>`
        SELECT
          Corps.id AS id,
          number,
          firstName,
          lastName,
          SUM(points) AS gigsAttended
        FROM Corps
        CROSS JOIN Gig
        LEFT JOIN GigSignup ON corpsId = Corps.id AND gigId = Gig.id
        WHERE number IS NULL
          AND attended = true
        GROUP BY Corps.id
        HAVING gigsAttended >= ${gigLimit}
      `;

    const rehearsals = (
      await ctx.prisma.corpsRehearsal.groupBy({
        by: ['corpsId'],
        where: {
          corps: {
            id: {
              in: gigLists.map((gigList) => gigList.id),
            },
          },
        },
        _count: {
          rehearsalId: true,
        },
        having: {
          rehearsalId: {
            _count: {
              gte: rehearsalLimit,
            },
          },
        },
      })
    ).reduce<Record<string, number>>((acc, corps) => {
      acc[corps.corpsId] = corps._count.rehearsalId;
      return acc;
    }, {});

    const { start, end } = calcOperatingYearInterval(getOperatingYear());
    const gigsThisYear = (
      await ctx.prisma.gigSignup.groupBy({
        by: ['corpsId'],
        _count: {
          gigId: true,
        },
        where: {
          gig: {
            date: {
              gte: start,
              lte: end,
            },
          },
          corps: {
            id: {
              in: gigLists.map((gigList) => gigList.id),
            },
          },
        },
      })
    ).reduce<Record<string, number>>((acc, corps) => {
      acc[corps.corpsId] = corps._count.gigId;
      return acc;
    }, {});

    type ReturnValue = CorpsGigs & {
      dateAchieved: Date;
    };

    const res: ReturnValue[] = [];
    for (const gigList of gigLists) {
      // Filter out corps with too few rehearsals
      const corpsRehearsals = rehearsals[gigList.id];
      if (!corpsRehearsals || corpsRehearsals < rehearsalLimit) {
        continue;
      }

      // Filter out corps that haven't been to a gig this operating year
      const corpsNoOfGigs = gigsThisYear[gigList.id];
      if (!corpsNoOfGigs || corpsNoOfGigs === 0) {
        continue;
      }

      const preliminaryMember = await ctx.prisma.gig.aggregate({
        where: {
          signups: {
            some: {
              corps: {
                id: gigList.id,
              },
              attended: true,
            },
          },
          points: {
            gt: 0,
          },
        },
        orderBy: {
          date: 'asc',
        },
        take: gigLimit,
        _max: {
          date: true,
        },
      });

      if (!preliminaryMember._max.date) {
        continue;
      }

      res.push({
        ...gigList,
        dateAchieved: preliminaryMember._max.date,
      });
    }

    res.sort((a, b) => a.dateAchieved.getTime() - b.dateAchieved.getTime());

    return res.map((corps, i) => ({
      ...corps,
      preliminaryNumber: currentMaxNumber + i + 1,
    }));
  }),

  getStreak: protectedProcedure
    .input(z.object({ getAll: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { getAll = false } = input ?? {};

      const recentGigs = await ctx.prisma.gig.findMany({
        where: {
          signups: {
            some: {
              attended: true,
            },
          },
          points: {
            gt: 0,
          },
        },
        include: {
          signups: getAll
            ? true
            : {
                where: {
                  corpsId: ctx.session.user.corps.id,
                },
              },
        },
        orderBy: {
          date: 'desc',
        },
        take: 100,
      });

      // Collect all corps ids
      const corpsIdsSet = new Set();
      const corpsIds: string[] = [];
      for (const gig of recentGigs) {
        for (const corpsId of gig.signups.map((s) => s.corpsId)) {
          if (corpsIdsSet.has(corpsId)) {
            continue;
          }
          corpsIdsSet.add(corpsId);
          corpsIds.push(corpsId);
        }
      }

      const streaks = new Map<string, number>();
      for (const corpsId of corpsIds) {
        let isDone = false;
        let gigIdx = 0;

        while (!isDone) {
          while (gigIdx < recentGigs.length) {
            const gig = recentGigs[gigIdx];
            if (!gig) {
              break;
            }

            const signup = gig.signups.find(
              (signup) => signup.corpsId === corpsId,
            );
            if (signup?.attended) {
              streaks.set(corpsId, (streaks.get(corpsId) ?? 0) + 1);
            } else {
              if (!gig.countsPositively) {
                isDone = true;
                break;
              }
            }
            gigIdx++;
          }

          // If we aren't done yet we need to collect more gigs
          if (!isDone) {
            const moreGigs = await ctx.prisma.gig.findMany({
              where: {
                signups: {
                  some: {
                    attended: true,
                  },
                },
                points: {
                  gt: 0,
                },
              },
              include: {
                signups: {
                  where: {
                    corpsId: {
                      in: corpsIds,
                    },
                  },
                },
              },
              orderBy: {
                date: 'desc',
              },
              take: 100,
              skip: recentGigs.length,
            });
            for (const gig of moreGigs) {
              recentGigs.push(gig);
            }
          }
        }
      }

      corpsIds.sort((a, b) => (streaks.get(b) ?? 0) - (streaks.get(a) ?? 0));

      return {
        corpsIds,
        streaks,
      };
    }),

  getAllTimeStreak: protectedProcedure
    .input(z.object({ corpsId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { corpsId } = input;
      const take = 400;

      const getGigs = (skip: number) =>
        ctx.prisma.gig.findMany({
          where: {
            signups: {
              some: {
                attended: true,
              },
            },
            points: {
              gt: 0,
            },
            date: {
              gt: new Date('1970-01-01'),
            },
          },
          select: {
            points: true,
            countsPositively: true,
            signups: {
              where: {
                corpsId,
              },
              select: {
                attended: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take,
          skip,
        });

      let skipIndex = 0;
      let currentStreak = 0;
      let currentAntiStreak = 0;
      const streaks: number[] = [];
      for (;;) {
        const gigs = await getGigs(skipIndex);
        if (gigs.length === 0) {
          break;
        }
        for (const gig of gigs) {
          const attended = gig.signups[0]?.attended ?? false;
          if (attended) {
            if (currentAntiStreak > 0) {
              streaks.push(-currentAntiStreak);
            }
            currentStreak += gig.points;
            currentAntiStreak = 0;
          } else if (!gig.countsPositively) {
            if (currentStreak > 0) {
              streaks.push(currentStreak);
            }
            currentAntiStreak += gig.points;
            currentStreak = 0;
          }
        }
        skipIndex += take;
      }
      return {
        maxStreak: Math.max(...streaks),
        streaks,
      };
    }),
});
