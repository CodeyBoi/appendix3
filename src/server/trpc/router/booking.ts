import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';

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
      }),
    )
    .query(({ ctx, input }) => {
      const { start, end } = input;
      const res = ctx.prisma.booking.findMany({
        where: {
          start: {
            gte: start,
          },
          end: {
            lte: end,
          },
        },
      });
      return res;
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string(),
        start: z.date(),
        end: z.date(),
      }),
    )
    .query(({ ctx, input }) => {
      const { id, ...inputData } = input;
      const isAdmin = ctx.session.user.corps.role?.name === 'admin';
      const data = {
        ...inputData,
        createdBy: {
          connect: {
            id: ctx.session.user.corps.id,
          },
        },
        approved: isAdmin,
      };
      const res = ctx.prisma.booking.upsert({
        where: { id },
        create: data,
        update: data,
      });
      return res;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;
      const res = ctx.prisma.booking.delete({
        where: { id },
      });
      return res;
    }),

  approve: adminProcedure
    .input(z.object({ id: z.string(), approved: z.boolean().optional() }))
    .query(({ ctx, input }) => {
      const { id, approved = true } = input;
      const res = ctx.prisma.booking.update({
        where: { id },
        data: { approved },
      });
      return res;
    }),
});
