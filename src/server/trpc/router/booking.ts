import { z } from 'zod';
import { router, protectedProcedure, restrictedProcedure } from '../trpc';

export const bookingRouter = router({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;
      const res = ctx.prisma.booking.findUnique({
        where: {
          id,
        },
      });
      return res;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        start: z.date().optional(),
        end: z.date().optional(),
        approved: z.boolean().optional().nullable(),
      }),
    )
    .query(({ ctx, input }) => {
      const { start, end, approved } = input;
      const res = ctx.prisma.booking.findMany({
        where: {
          start: {
            gte: start,
          },
          end: {
            lte: end,
          },
          approved,
        },
      });
      return res;
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        start: z.date(),
        end: z.date(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id = '', ...inputData } = input;
      const data = {
        ...inputData,
        description: inputData.description || '',
        createdBy: {
          connect: {
            id: ctx.session.user.corps.id,
          },
        },
      };
      const res = ctx.prisma.booking.upsert({
        where: { id },
        create: data,
        update: data,
      });
      return res;
    }),

  delete: restrictedProcedure('manageBookings')
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { id } = input;
      const res = ctx.prisma.booking.delete({
        where: { id },
      });
      return res;
    }),

  approve: restrictedProcedure('manageBookings')
    .input(
      z.object({ id: z.string(), approved: z.boolean().optional().nullable() }),
    )
    .mutation(({ ctx, input }) => {
      const { id, approved } = input;
      const corpsId = ctx.session.user.corps.id;
      const res = ctx.prisma.booking.update({
        where: { id },
        data: {
          approved,
          approvedBy: {
            connect: {
              id: corpsId,
            },
          },
          approvedAt: new Date(),
        },
      });
      return res;
    }),

  getUnprocessed: restrictedProcedure('manageBookings').mutation(({ ctx }) => {
    const res = ctx.prisma.booking.findMany({
      where: { approved: null },
    });
    return res;
  }),
});
