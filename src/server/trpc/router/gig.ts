import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const gigRouter = router({
  getMany: publicProcedure
    .input(z.object({
      corpsId: z.number(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(({ ctx, input }) => {
      return ctx.prisma.gig.findMany({
        include: {
          type: {
            select: {
              name: true,
            },
          },
        },
        where: {
          hiddenFor: {
            none: {
              corpsId: input.corpsId,
            },
          },
          AND: {
            date: {
              gte: input.startDate,
              lte: input.endDate,
            },
          },
        },
      });
    }),
  signupStatus: publicProcedure
    .input(z.object({
      corpsId: z.number(),
      gigId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gigSignup.findFirst({
        select: {
          status: {
            select: {
              value: true,
            },
          },
        },
        where: {
          corpsId: input.corpsId,
          gigId: input.gigId,
        },
      });
    }),
});
