import dayjs from 'dayjs';
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from '../trpc';
import { z } from 'zod';

export const gigRouter = router({
  getWithId: protectedProcedure
    .input(z.object({ gigId: z.string() }))
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
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        dateOrder: z.enum(['asc', 'desc']).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const corpsId = ctx.session?.user?.corps?.id;
      const visibilityFilter =
        corpsId !== undefined
          ? {
              OR: [
                {
                  hiddenFor: {
                    none: {
                      corpsId,
                    },
                  },
                },
                {
                  // Stops hiding gig if it's in the past
                  date: {
                    gt: dayjs().startOf('day').toDate(),
                  },
                },
              ],
            }
          : {
              isPublic: true,
            };
      return ctx.prisma.gig.findMany({
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
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
          ...visibilityFilter,
        },
        orderBy: [
          {
            date: input.dateOrder ?? 'asc',
          },
          {
            meetup: 'asc',
          },
          {
            start: 'asc',
          },
        ],
      });
    }),

  upsert: adminProcedure
    .input(
      z.object({
        gigId: z.string().optional(),
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.points < 0) {
        throw new Error('Points cannot be negative');
      }
      await ctx.prisma.hiddenGig.deleteMany({
        where: {
          gigId: input.gigId,
        },
      });
      const { gigId, ...data } = {
        ...input,
        hiddenFor: {
          create: input.hiddenFor?.map((corpsId) => ({
            corpsId,
          })),
        },
        type: {
          connect: {
            name: input.type,
          },
        },
      };
      return ctx.prisma.gig.upsert({
        where: {
          id: gigId ?? '',
        },
        update: data,
        create: data,
      });
    }),

  remove: adminProcedure
    .input(z.object({ gigId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.gig.delete({
        where: {
          id: input.gigId,
        },
      });
    }),

  getSignup: protectedProcedure
    .input(
      z.object({
        corpsId: z.string(),
        gigId: z.string(),
      }),
    )
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

  getSignups: protectedProcedure
    .input(
      z.object({
        gigId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      interface WhosComingEntry {
        corpsId: string;
        firstName: string;
        lastName: string;
        number?: number;
        instrument: string;
        signupStatus: string;
        attended: boolean;
        checkbox1: boolean;
        checkbox2: boolean;
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
          GigSignup.checkbox1 AS checkbox1,
          GigSignup.checkbox2 AS checkbox2
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        JOIN Corps ON Corps.id = GigSignup.corpsId
        JOIN GigSignupStatus ON GigSignupStatus.id = GigSignup.signupStatusId
        JOIN Instrument ON Instrument.id = GigSignup.instrumentId
        WHERE GigSignup.gigId = ${input.gigId}
        ORDER BY
          signupStatus,
          ISNULL(Corps.number), Corps.number,
          Corps.lastName,
          Corps.firstName
      `;
    }),

  addSignup: protectedProcedure
    .input(
      z.object({
        corpsId: z.string(),
        gigId: z.string(),
        status: z.string(),
        instrument: z.string().optional(),
        checkbox1: z.boolean(),
        checkbox2: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let instrument: string;
      if (!input.instrument) {
        instrument =
          (
            await ctx.prisma.corpsInstrument.findFirst({
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
            })
          )?.instrument.name ?? 'Annat';
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
          checkbox1: input.checkbox1,
          checkbox2: input.checkbox2,
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

  addSignups: adminProcedure
    .input(
      z.object({
        corpsIds: z.array(z.string()),
        gigId: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const instruments = await ctx.prisma.corpsInstrument.findMany({
        select: {
          corpsId: true,
          instrument: {
            select: {
              name: true,
            },
          },
        },
        where: {
          corpsId: {
            in: input.corpsIds,
          },
          isMainInstrument: true,
        },
      });
      return ctx.prisma.$transaction(
        input.corpsIds.map((corpsId) =>
          ctx.prisma.gigSignup.upsert({
            where: {
              corpsId_gigId: {
                corpsId,
                gigId: input.gigId,
              },
            },
            update: {
              status: {
                connect: {
                  value: input.status,
                },
              },
            },
            create: {
              corps: {
                connect: {
                  id: corpsId,
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
                  name:
                    instruments.find((i) => i.corpsId === corpsId)?.instrument
                      .name ?? 'Annat',
                },
              },
            },
          }),
        ),
      );
    }),

  removeSignup: adminProcedure
    .input(
      z.object({
        corpsId: z.string(),
        gigId: z.string(),
      }),
    )
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

  editAttendance: adminProcedure
    .input(
      z.object({
        corpsId: z.string(),
        gigId: z.string(),
        attended: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

  getAttended: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const corpsId = ctx.session?.user?.corps?.id;
      if (!corpsId) {
        throw new Error('Not logged in');
      }
      return ctx.prisma.gig.findMany({
        where: {
          signups: {
            some: {
              corpsId,
              attended: true,
            },
          },
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    }),
});
