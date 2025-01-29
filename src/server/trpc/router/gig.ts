import dayjs from 'dayjs';
import { z } from 'zod';
import {
  protectedProcedure,
  publicProcedure,
  restrictedProcedure,
  router,
} from '../trpc';
import * as ics from 'ics'
import { title } from 'process';
import { start } from 'repl';

interface Gig {
  id: string;
  title: string;
  date: Date;
  type: {
    name: string;
  };
  meetup: string | null;
  start: string | null;
  location: string | null;
  description: string | null;
  englishDescription: string | null;
}

const sendDiscordAlert = async (gig: Gig) => {
  if (!process.env.DISCORD_WEBHOOK_GIG_URL) {
    return;
  }
  const info = [];
  info.push(`# ${gig.title}`.trim());
  info.push(
    `*${
      gig.meetup ? 'Samling ' + gig.meetup + ' d' : 'D'
    }en ${gig.date.toLocaleDateString('sv', {
      day: 'numeric',
      month: 'long',
    })}${gig.location?.trim() ? ', ' + gig.location.trim() : ''}*`,
  );
  info.push('');
  if (gig.description?.trim()) {
    info.push(gig.description.trim());
    info.push('');
  }
  if (gig.englishDescription?.trim()) {
    info.push(gig.englishDescription.trim());
    info.push('');
  }
  info.push(`[Anmälan!](<${process.env.NEXTAUTH_URL}/gig/${gig.id}>)`);
  await fetch(process.env.DISCORD_WEBHOOK_GIG_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: info.join('\n'),
    }),
  });
};

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
      const { startDate, endDate, dateOrder = 'asc' } = input;
      const corpsId = ctx.session?.user?.corps?.id;
      const visibilityFilter =
        corpsId === undefined
          ? {
              isPublic: true,
            }
          : {
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
            gte: startDate
              ? dayjs(startDate).startOf('day').toDate()
              : undefined,
            lte: endDate ? dayjs(endDate).endOf('day').toDate() : undefined,
          },
          ...visibilityFilter,
        },
        orderBy: [
          {
            date: dateOrder,
          },
          {
            meetup: dateOrder,
          },
          {
            start: dateOrder,
          },
        ],
      });
    }),

  upsert: restrictedProcedure('manageGigs')
    .input(
      z.object({
        gigId: z.string().optional(),
        title: z.string(),
        date: z.date(),
        type: z.string(),
        points: z.number().int().nonnegative("Points can't be negative"),
        price: z.number().int().nonnegative('Price cannot be negative'),
        meetup: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
        location: z.string().optional(),
        signupStart: z.date().nullable(),
        signupEnd: z.date().nullable(),
        description: z.string().optional(),
        englishDescription: z.string().optional(),
        publicDescription: z.string().optional(),
        countsPositively: z.boolean().optional(),
        isPublic: z.boolean().optional(),
        checkbox1: z.string().optional(),
        checkbox2: z.string().optional(),
        hiddenFor: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const existingGig = await ctx.prisma.gig.findUnique({
        where: {
          id: gigId ?? '',
        },
      });

      if (existingGig !== null) {
        const gig = await ctx.prisma.gig.update({
          where: {
            id: gigId ?? '',
          },
          data,
        });
        return gig;
      }

      const gig = await ctx.prisma.gig.create({
        include: {
          type: {
            select: {
              name: true,
            },
          },
        },
        data,
      });

      // Send discord alert if new gig on production server
      if (
        process.env.DISCORD_WEBHOOK_GIG_URL &&
        gig.date.getTime() + 1000 * 60 * 60 * 24 > new Date().getTime()
      ) {
        await sendDiscordAlert(gig);
      }

      return gig;
    }),

  remove: restrictedProcedure('manageGigs')
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
          checkbox1: true,
          checkbox2: true,
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
      const result = ctx.prisma.gigSignup.findMany({
        where: {
          gigId: input.gigId,
        },
        include: {
          corps: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              nickName: true,
              fullName: true,
              displayName: true,
              number: true,
            },
          },
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
        orderBy: [
          {
            signupStatusId: 'asc',
          },
          {
            corps: {
              number: {
                sort: 'asc',
                nulls: 'last',
              },
            },
          },
          {
            corps: {
              lastName: 'asc',
            },
          },
          {
            corps: {
              firstName: 'asc',
            },
          },
        ],
      });
      return result;
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
              value: input.status || 'Ja',
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
              value: input.status || 'Ja',
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
      });
    }),

  addSignups: restrictedProcedure('manageAttendance')
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

  removeSignup: restrictedProcedure('manageAttendance')
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

  editAttendance: restrictedProcedure('manageAttendance')
    .input(
      z.object({
        corpsId: z.string(),
        gigId: z.string(),
        attended: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { corpsId, gigId, attended } = input;
      const signup = await ctx.prisma.gigSignup.findUnique({
        where: {
          corpsId_gigId: {
            corpsId,
            gigId,
          },
        },
      });
      if (!signup) {
        throw new Error('Signup not found');
      }
      return ctx.prisma.gigSignup.update({
        where: {
          corpsId_gigId: {
            corpsId,
            gigId,
          },
        },
        data: {
          attended,
          updatedAt: signup.updatedAt,
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
      const corpsId = ctx.session.user.corps.id;
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
        orderBy: [
          {
            date: 'desc',
          },
          {
            meetup: 'desc',
          },
          {
            start: 'desc',
          },
        ],
      });
    }),

  getChristmasConcert: protectedProcedure
    .input(
      z.object({
        year: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const year = input.year ?? new Date().getFullYear();
      const gig = await ctx.prisma.gig.findFirst({
        include: {
          signups: {
            include: {
              corps: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  nickName: true,
                  number: true,
                },
              },
            },
            where: {
              status: {
                value: 'Ja',
              },
            },
            orderBy: [
              {
                corps: {
                  number: {
                    sort: 'asc',
                    nulls: 'last',
                  },
                },
              },
              {
                corps: {
                  lastName: 'asc',
                },
              },
              {
                corps: {
                  firstName: 'asc',
                },
              },
            ],
          },
        },
        where: {
          type: {
            name: 'Julkoncert!',
          },
          date: {
            gte: new Date(year, 11, 1),
            lte: new Date(year + 1, 0, 1),
          },
        },
      });
      return gig;
    }),

  exportCalendar: publicProcedure
    .input(z.object({ corpsId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      // Call this endpoint at `${getUrl()}/gig.exportCalendar?input=${
      //   encodeURIComponent(JSON.stringify({
      //     json: { corpsId },
      //   })
      // )}`
      // aka (for dev)
      // http://localhost:3000/api/trpc/gig.exportCalendar?input={%22json%22%3A{%22corpsId%22%3A%22<<CORPSID>>%22}}
      const corpsId = input.corpsId;

      const startDate = dayjs().subtract(2, 'years').startOf('year').toDate();
      const endDate = dayjs().add(1, 'year').endOf('year').toDate();

      const data = await ctx.prisma.gig.findMany({
        include: {
          type: {
            select: {
              name: true,
            },
          },
        },
        where: {
          date: {
            gte: startDate
              ? dayjs(startDate).startOf('day').toDate()
              : undefined,
            lte: endDate ? dayjs(endDate).endOf('day').toDate() : undefined,
          },
          signups: {
            signupStatusId: 1,
            corpsId: corpsId,
          }
        },
        orderBy: [
          {
            date: 'asc',
          },
          {
            meetup: 'asc',
          },
          {
            start: 'asc',
          },
        ],
      });
    
      const generateCalendarArray = (gig): ics.EventAttributes => {
        const [year, month, day] = dayjs(gig.date).format('YYYY:MM:DD').split(':').map((input:string)=> {return parseInt(input)});
        if (!(gig.meetup.includes(':') || gig.meetup.includes('.'))) return {start: [1970, 1, 1], duration: {minutes:1}};
        const [meetupHour, meetupMinute] = gig.meetup.split(/[:.]/).map((input:string)=> {return parseInt(input)});
        if (isNaN(meetupHour) || isNaN(meetupMinute)) return {start: [1970, 1, 1], duration: {minutes:1}};
        const meetup:number[] = [year, month, day, meetupHour, meetupMinute];
    
        const hasEndTime =
          !!gig.end && (gig.end.includes(':') || gig.end.includes('.'));
        const hasStartTime =
          !!gig.start && (gig.start.includes(':') || gig.start.includes('.'));
    
        if (hasEndTime) {
          const [endHour, endMinute] = gig.end.split(/[:.]/).map((input:string)=> {return parseInt(input)});
          if (isNaN(endHour) || isNaN(endMinute)) return {start: [1970, 1, 1], duration: {minutes:1}};
          const end = [year, month, day, endHour, endMinute];
          return {
            title: gig.title,
            start: meetup,
            end: end,
            description: gig.description,
            location: gig.location
          };
        } else if (hasStartTime) {
          const [startHour, startMinute] = gig.start.split(/[:.]/).map((input:string)=> {return parseInt(input)});
          if (isNaN(startHour) || isNaN(startMinute)) return {start: [1970, 1, 1], duration: {minutes:1}};
          const isHourEleven = parseInt(startHour) === 23;
          const end = isHourEleven
            ? [year, month, day, 23, startMinute]
            : [year, month, day, startHour+1, startMinute];
          return {
            title: gig.title,
            start: meetup,
            end: end,
            description: gig.description,
            location: gig.location
          };
        }
        return {start: [1970, 1, 1], duration: {minutes:1}};
      };


      const new_data = data.map(generateCalendarArray);

      const { error, value } = ics.createEvents(new_data)
      
      if (error) {
        console.log(error)
        return
      }

      const filename = `Spelningskalender_${startDate.getFullYear()}-${endDate.getFullYear()}.ics`;
      ctx.res.setHeader('Content-Type', 'text/calendar');
      ctx.res.setHeader(
        'Content-Disposition',
        `attachment; filename=${filename}`,
      );
      ctx.res.send(value);
      return {
        success: true,
      };
    }),
});
