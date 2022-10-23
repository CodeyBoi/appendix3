import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const gigRouter = router({
  getWithId: publicProcedure
    .input(z.object({ gigId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.gig.findUnique({
        where: {
          id: input.gigId,
        },
      });
    }),

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

  getSignup: publicProcedure
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
          instrument: {
            select: {
              name: true,
            },
          },
        },
        where: {
          corpsId: input.corpsId,
          gigId: input.gigId,
        },
      });
    }),
  
  getSignups: publicProcedure
    .input(z.object({
      gigId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.gigSignup.findMany({
        select: {
          status: {
            select: {
              value: true,
            },
          },
          instrument: {
            select: {
              name: true,
            },
          },
          corps: {
            select: {
              number: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          gigId: input.gigId,
        },
        orderBy: {
          corps: {
            number: "asc",
            lastName: "asc",
            firstName: "asc",
          },
        },

      // TODO: Rewrite into a raw SQL query

      });


  addSignup: protectedProcedure
    .input(z.object({
      corpsId: z.number(),
      gigId: z.number(),
      status: z.string().optional(),
      instrument: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gigSignup.upsert({
        where: {
          corpsId_gigId: {
            corpsId: input.corpsId,
            gigId: input.gigId,
          },
        },
        update: {
          status: {
            connect: {
              value: input.status,
            },
          },
          instrument: {
            connect: {
              name: input.instrument,
            },
          },
        },
        create: {
          corps: {
            connect: {
              id: input.corpsId,
            },
          },
          gig: {
            connect: {
              id: input.gigId,
            },
          },
          status: {
            connect: {
              value: input.status,
            },
          },
          instrument: {
            connect: {
              name: input.instrument,
            },
          },
        },
      });
    }),
});
