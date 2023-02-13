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

      const corpsIds = rehearsal.corpsii.map((corps) => corps.corps.id) ?? [];
      return {
        id: rehearsal.id,
        title: rehearsal.title,
        date: rehearsal.date,
        type: rehearsal.type.name,
        corpsIds,
      };
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
        type: z.string(),
        corpsIds: z.array(z.string().cuid('Invalid CUID')).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, date, type, corpsIds } = input;
      // Remove all corpsRehearsals for this rehearsal if updating an existing rehearsal
      if (id) {
        await ctx.prisma.corpsRehearsal.deleteMany({
          where: { rehearsalId: id },
        });
      }
      const data = {
        title,
        date,
        corpsii: {
          create: corpsIds?.map((corpsId) => ({
            corps: {
              connect: { id: corpsId },
            },
          })),
        },
        type: {
          connect: { name: type },
        },
      };
      const rehearsal = await ctx.prisma.rehearsal.upsert({
        where: { id: id ?? '' },
        create: data,
        update: data,
      });
      return rehearsal;
    }),

  updateAttendance: adminProcedure
    .input(
      z.object({
        rehearsalId: z.string().cuid('Invalid CUID'),
        corpsIds: z.array(z.string().cuid('Invalid CUID')),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { rehearsalId, corpsIds } = input;
      await ctx.prisma.corpsRehearsal.deleteMany({
        where: { rehearsalId },
      });
      await ctx.prisma.corpsRehearsal.createMany({
        data: corpsIds.map((corpsId) => ({
          corpsId,
          rehearsalId,
        })),
      });
      const rehearsal = await ctx.prisma.rehearsal.findUnique({
        where: { id: rehearsalId },
      });
      return rehearsal;
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
      const rehearsals = await ctx.prisma.rehearsal.aggregate({
        where: whereRehearsal,
        _count: {
          _all: true,
        },
      });
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
        rehearsalCount: rehearsals._count._all,
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
      const rehearsals = await ctx.prisma.rehearsal.aggregate({
        where: whereRehearsal,
        _count: {
          _all: true,
        },
      });
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
        rehearsalCount: rehearsals._count._all,
        stats: stats.map((stat) => ({
          corps: corps[stat.corpsId] as Corps,
          count: stat._count.rehearsalId,
        })),
      };
    }),

  getTypes: adminProcedure.query(async ({ ctx }) => {
    const types = await ctx.prisma.rehearsalType.findMany();
    return types.map((type) => type.name);
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
        },
      });
      return attendance / allRehearsals;
    }),
});
