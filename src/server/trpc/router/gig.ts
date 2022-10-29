import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const gigRouter = router({
  getWithId: publicProcedure
    .input(z.object({ gigId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.gig.findUnique({
        include: {
          type: {
            select: {
              name: true,
            },
          },
          hiddenFor: {
            select: {
              corpsId: true,
            },
          },
        },
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

  upsert: protectedProcedure
    .input(z.object({
      gigId: z.number().optional(),
      title: z.string(),
      date: z.date(),
      type: z.string(),
      points: z.number(),
      meetup: z.string().optional(),
      start: z.string().optional(),
      location: z.string().optional(),
      signupStart: z.date().nullable(),
      signupEnd: z.date().nullable(),
      description: z.string().optional(),
      countsPositively: z.boolean().optional(),
      isPublic: z.boolean().optional(),
      checkbox1: z.string().optional(),
      checkbox2: z.string().optional(),
      hiddenFor: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.points < 0) {
        throw new Error("Points cannot be negative");
      }
      const { gigId, ...data} = {
        ...input,
        hiddenFor: {
          create: input.hiddenFor?.map((corpsId) => ({ corpsId: parseInt(corpsId) })),
        },
        type: {
          connect: {
            name: input.type,
          },
        },
      };
      return ctx.prisma.gig.upsert({
        where: {
          id: gigId,
        },
        update: data,
        create: data,
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

      interface WhosComingEntry {
        corpsId: number;
        firstName: string;
        lastName: string;
        number?: number;
        instrument: string;
        signupStatus: string;
        attended: boolean;
      }

      return ctx.prisma.$queryRaw<WhosComingEntry[]>`
        SELECT
          Corps.id AS corpsId,
          Corps.firstName AS firstName,
          Corps.lastName AS lastName,
          Corps.number AS number,
          Instrument.name AS instrument,
          GigSignupStatus.value AS signupStatus,
          GigSignup.attended AS attended
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        JOIN Corps ON Corps.id = GigSignup.corpsId
        JOIN GigSignupStatus ON GigSignupStatus.id = GigSignup.signupStatusId
        JOIN Instrument ON Instrument.id = GigSignup.instrumentId
        WHERE GigSignup.gigId = ${input.gigId}
        ORDER BY
          signupStatus,
          Corps.number NULLS LAST,
          Corps.lastName,
          Corps.firstName
      `;
    }),

  addSignup: protectedProcedure
    .input(z.object({
      corpsId: z.number(),
      gigId: z.number(),
      status: z.string(),
      instrument: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {

      let instrument: string;
      if (!input.instrument) {
        instrument = (await ctx.prisma.corpsInstrument.findFirst({
          select: {
            instrument: {
              select: {
                name: true,
              },
            },
          },
          where: {
            corpsId: input.corpsId,
            isMainInstrument: true,
          },
        }))?.instrument.name ?? "Annat";
      } else {
        instrument = input.instrument;
      }

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
              name: instrument,
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
              name: instrument,
            },
          },
        },
      });
    }),

  removeSignup: protectedProcedure
    .input(z.object({
      corpsId: z.number(),
      gigId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gigSignup.delete({
        where: {
          corpsId_gigId: {
            corpsId: input.corpsId,
            gigId: input.gigId,
          },
        },
      });
    }),

  editAttendance: protectedProcedure
    .input(z.object({
      corpsId: z.number(),
      gigId: z.number(),
      attended: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.prisma.user.findUnique({
        where: {
          id: "1",
        },
        include: {
          corps: true,
        },
      });
    
      return {
        user: {
          id: "1",
        },
      };
      return ctx.prisma.gigSignup.update({
        where: {
          corpsId_gigId: {
            corpsId: input.corpsId,
            gigId: input.gigId,
          },
        },
        data: {
          attended: input.attended,
        },
      });
    }),
});

const getSession = () => {
  
}