import { Corps } from '@prisma/client';
import { z } from 'zod';
import { router, adminProcedure, protectedProcedure } from '../trpc';

export const rehearsalRouter = router({
  getWithId: adminProcedure
    .input(z.string().cuid('Invalid CUID'))
    .query(async ({ ctx, input }) => {
      const rehearsal = await ctx.prisma.rehearsal.findUnique({
        where: { id: input },
        include: {
          type: {
            select: {
              name: true,
            },
          },
          corpsii: {
            select: {
              corps: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!rehearsal) {
        throw new Error('Rehearsal not found');
      }

      return rehearsal;
    }),

  getMany: adminProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const rehearsals = await ctx.prisma.rehearsal.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        include: {
          type: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
      return rehearsals.map((rehearsal) => ({
        id: rehearsal.id,
        title: rehearsal.title,
        date: rehearsal.date,
        type: rehearsal.type.name,
      }));
    }),

  upsert: adminProcedure
    .input(
      z.object({
        id: z.string().cuid('Invalid CUID').optional(),
        title: z.string(),
        date: z.date(),
        typeId: z.number(),
        countsPositively: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, date, typeId, countsPositively } = input;
      const data = {
        title,
        date,
        type: {
          connect: { id: typeId },
        },
        countsPositively,
      };
      const rehearsal = await ctx.prisma.rehearsal.upsert({
        where: { id: id ?? '' },
        create: data,
        update: data,
      });
      return rehearsal;
    }),

  remove: adminProcedure
    .input(z.string().cuid('Invalid CUID'))
    .mutation(async ({ ctx, input }) => {
      const rehearsal = await ctx.prisma.rehearsal.delete({
        where: { id: input },
      });
      return rehearsal;
    }),

  getAttendence: adminProcedure
    .input(
      z.object({
        corpsId: z.string().cuid('Invalid CUID'),
        id: z.string().cuid('Invalid CUID'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { corpsId, id: rehearsalId } = input;
      const attendance = await ctx.prisma.corpsRehearsal.findUnique({
        where: {
          corpsId_rehearsalId: {
            corpsId,
            rehearsalId,
          },
        },
      });
      return !!attendance;
    }),

  updateAttendance: adminProcedure
    .input(
      z.object({
        id: z.string().cuid('Invalid CUID'),
        corpsId: z.string().cuid('Invalid CUID'),
        attended: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: rehearsalId, corpsId, attended } = input;
      if (attended) {
        return ctx.prisma.corpsRehearsal.create({
          data: {
            corpsId,
            rehearsalId,
          },
        });
      } else {
        return ctx.prisma.corpsRehearsal.delete({
          where: {
            corpsId_rehearsalId: {
              corpsId,
              rehearsalId,
            },
          },
        });
      }
    }),

  getOrchestraStats: adminProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const whereRehearsal = {
        date: {
          gte: start,
          lte: end,
        },
        type: {
          name: 'Orkesterrepa',
        },
      };
      const rehearsals = await ctx.prisma.rehearsal.findMany({
        where: whereRehearsal,
      });
      const nonPositiveRehearsals = rehearsals.filter(
        (rehearsal) => !rehearsal.countsPositively,
      ).length;
      const stats = await ctx.prisma.corpsRehearsal.groupBy({
        by: ['corpsId'],
        where: {
          rehearsal: whereRehearsal,
        },
        _count: {
          rehearsalId: true,
        },
        having: {
          rehearsalId: {
            _count: {
              gt: 0,
            },
          },
        },
        orderBy: {
          _count: {
            rehearsalId: 'desc',
          },
        },
      });
      const corpsIds = stats.map((stat) => stat.corpsId);
      const corps = (
        await ctx.prisma.corps.findMany({
          where: {
            id: {
              in: corpsIds,
            },
          },
        })
      ).reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Corps>);
      return {
        nonPositiveRehearsals,
        stats: stats.map((stat) => ({
          corps: corps[stat.corpsId] as Corps,
          count: stat._count.rehearsalId,
        })),
      };
    }),

  getBalletStats: adminProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const whereRehearsal = {
        date: {
          gte: start,
          lte: end,
        },
        type: {
          name: 'Balettrepa',
        },
      };
      const rehearsals = await ctx.prisma.rehearsal.findMany({
        where: whereRehearsal,
      });
      const nonPositiveRehearsals = rehearsals.filter(
        (rehearsal) => !rehearsal.countsPositively,
      ).length;
      const stats = await ctx.prisma.corpsRehearsal.groupBy({
        by: ['corpsId'],
        where: {
          rehearsal: whereRehearsal,
        },
        _count: {
          rehearsalId: true,
        },
        having: {
          rehearsalId: {
            _count: {
              gt: 0,
            },
          },
        },
        orderBy: {
          _count: {
            rehearsalId: 'desc',
          },
        },
      });
      const corpsIds = stats.map((stat) => stat.corpsId);
      const corps = (
        await ctx.prisma.corps.findMany({
          where: {
            id: {
              in: corpsIds,
            },
          },
        })
      ).reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Corps>);
      return {
        nonPositiveRehearsals,
        stats: stats.map((stat) => ({
          corps: corps[stat.corpsId] as Corps,
          count: stat._count.rehearsalId,
        })),
      };
    }),

  getTypes: adminProcedure.query(async ({ ctx }) => {
    const types = await ctx.prisma.rehearsalType.findMany();
    return types;
  }),

  getOwnOrchestraAttendance: protectedProcedure
    .input(z.object({ start: z.date().optional(), end: z.date().optional() }))
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const corpsId = ctx.session.user.corps.id;
      const attendance = await ctx.prisma.corpsRehearsal.count({
        where: {
          corpsId,
          rehearsal: {
            type: {
              name: 'Orkesterrepa',
            },
            date: {
              gte: start,
              lte: end,
            },
          },
        },
      });
      const allRehearsals = await ctx.prisma.rehearsal.count({
        where: {
          type: {
            name: 'Orkesterrepa',
          },
          date: {
            gte: start,
            lte: end,
          },
          countsPositively: false,
        },
      });
      return attendance / allRehearsals;
    }),

  getOwnBalletAttendance: protectedProcedure
    .input(z.object({ start: z.date().optional(), end: z.date().optional() }))
    .query(async ({ ctx, input }) => {
      const { start, end } = input;
      const corpsId = ctx.session.user.corps.id;
      const attendance = await ctx.prisma.corpsRehearsal.count({
        where: {
          corpsId,
          rehearsal: {
            type: {
              name: 'Balettrepa',
            },
            date: {
              gte: start,
              lte: end,
            },
          },
        },
      });
      const allRehearsals = await ctx.prisma.rehearsal.count({
        where: {
          type: {
            name: 'Balettrepa',
          },
          date: {
            gte: start,
            lte: end,
          },
          countsPositively: false,
        },
      });
      return attendance / allRehearsals;
    }),

  getAttendedRehearsalList: adminProcedure
    .input(
      z.object({
        id: z.string().cuid('Invalid CUID'),
        start: z.date().optional(),
        end: z.date().optional(),
        typeId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id, start, end, typeId } = input;
      const corpsii = await ctx.prisma.corps.findMany({
        include: {
          instruments: {
            include: {
              instrument: {
                include: {
                  section: true,
                },
              },
            },
            where: {
              isMainInstrument: true,
            },
          },
        },
        where: {
          rehearsals: {
            some: {
              rehearsal: {
                OR: [
                  {
                    date: {
                      gte: start,
                      lte: end,
                    },
                  },
                  {
                    id,
                  },
                ],
                typeId,
              },
            },
          },
        },
        orderBy: [
          {
            number: {
              sort: 'asc',
              nulls: 'last',
            },
          },
          {
            lastName: 'asc',
          },
          {
            firstName: 'asc',
          },
        ],
      });
      const getMainInstrument = (corps: (typeof corpsii)[number]) => {
        for (const instrument of corps.instruments) {
          if (instrument.isMainInstrument) {
            return instrument.instrument.name;
          }
        }
        return 'Annat';
      };
      const instruments = await ctx.prisma.instrument.findMany({});
      const instrumentPrecedence = instruments.reduce((acc, instrument) => {
        acc[instrument.name] = instrument.sectionId || 516;
        return acc;
      }, {} as Record<string, number>);
      corpsii.sort(
        (a, b) =>
          (instrumentPrecedence[getMainInstrument(a)] ?? 516) -
          (instrumentPrecedence[getMainInstrument(b)] ?? 516),
      );

      const attended = await ctx.prisma.corpsRehearsal.findMany({
        where: {
          rehearsalId: id,
        },
      });
      const corpsIds = new Set(attended.map((e) => e.corpsId));

      let lastSectionName = '';
      const result = corpsii.reduce((acc, corps) => {
        const sectionName = corps.instruments[0]?.instrument.section?.name;
        if (!sectionName) return acc;
        if (lastSectionName !== sectionName) {
          acc.push({
            name: sectionName,
            corpsii: [],
          });
          lastSectionName = sectionName;
        }
        const c = {
          ...corps,
          attended: corpsIds.has(corps.id),
        };
        acc[acc.length - 1]?.corpsii.push(c);
        return acc;
      }, [] as { name: string; corpsii: ((typeof corpsii)[number] & { attended: boolean })[] }[]);
      return {
        corpsiiBySection: result,
        corpsIds,
      };
    }),
});
