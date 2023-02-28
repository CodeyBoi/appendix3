import { adminProcedure } from './../trpc';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { setCookie } from 'cookies-next';

export const corpsRouter = router({
  getSelf: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.corps.findUnique({
      include: {
        instruments: {
          include: {
            instrument: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
        foodPrefs: true,
      },
      where: {
        userId: ctx.session?.user.id || undefined,
      },
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.corps.findUnique({
        include: {
          instruments: {
            select: {
              instrument: {
                select: {
                  name: true,
                },
              },
              isMainInstrument: true,
            },
          },
          user: {
            select: {
              email: true,
            },
          },
          role: {
            select: {
              name: true,
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    }),

  updateSelf: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        drinksAlcohol: z.boolean(),
        vegetarian: z.boolean(),
        vegan: z.boolean(),
        glutenFree: z.boolean(),
        lactoseFree: z.boolean(),
        otherFoodPrefs: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const corps = await ctx.prisma.corps.findUnique({
        where: {
          userId: ctx.session?.user.id || undefined,
        },
      });

      if (corps === null) {
        throw new Error('Not logged in');
      }

      const foodPrefs = {
        drinksAlcohol: input.drinksAlcohol,
        vegetarian: input.vegetarian,
        vegan: input.vegan,
        glutenFree: input.glutenFree,
        lactoseFree: input.lactoseFree,
        other: input.otherFoodPrefs,
      };

      return ctx.prisma.corps.update({
        where: {
          id: corps.id,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          user: {
            update: {
              email: input.email,
            },
          },
          foodPrefs: {
            upsert: {
              create: foodPrefs,
              update: foodPrefs,
            },
          },
        },
      });
    }),

  upsert: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
        number: z.number().nullable(),
        bNumber: z.number().nullable(),
        email: z.string(),
        mainInstrument: z.string(),
        otherInstruments: z.array(z.string()),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.otherInstruments.includes(input.mainInstrument)) {
        throw new Error('Main instrument cannot be in other instruments');
      }
      const instruments = await ctx.prisma.instrument.findMany({});
      const queryData = {
        firstName: input.firstName,
        lastName: input.lastName,
        number: input.number,
        bNumber: input.bNumber,
        instruments: {
          createMany: {
            data: [
              {
                instrumentId:
                  instruments.find(
                    (instrument) => instrument.name === input.mainInstrument,
                  )?.id ?? 19,
                isMainInstrument: true,
              },
              ...input.otherInstruments.map((instrument) => ({
                instrumentId:
                  instruments.find((i) => i.name === instrument)?.id ?? 19,
                isMainInstrument: false,
              })),
            ],
          },
        },
        role: {
          connect: {
            name: input.role,
          },
        },
      };

      if (input.id) {
        await ctx.prisma.corpsInstrument.deleteMany({
          where: {
            corpsId: input.id,
          },
        });
      }

      return ctx.prisma.corps.upsert({
        where: {
          id: input.id ?? '',
        },
        update: {
          ...queryData,
          user: {
            update: {
              email: input.email,
            },
          },
        },
        create: {
          ...queryData,
          user: {
            connectOrCreate: {
              where: {
                email: input.email,
              },
              create: {
                email: input.email,
              },
            },
          },
        },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.string().optional(),
        instrument: z.string().optional(),
        excludeSelf: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const number = parseInt(input.search ?? '');
      const bNumber = parseInt(input.search ?? '');
      const corpsii = await ctx.prisma.corps.findMany({
        where: {
          userId: input.excludeSelf
            ? {
                not: ctx.session?.user.id || undefined,
              }
            : undefined,
          OR: [
            {
              firstName: {
                contains: input.search,
              },
            },
            {
              lastName: {
                contains: input.search,
              },
            },
            {
              number: isNaN(number) ? undefined : number,
            },
            {
              bNumber: isNaN(bNumber) ? undefined : bNumber,
            },
            {
              instruments: {
                some: {
                  instrument: {
                    name: {
                      contains: input.search,
                    },
                  },
                },
              },
            },
            {
              role: {
                name: {
                  contains: input.search,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          number: true,
          instruments: {
            select: {
              instrument: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          {
            number: {
              // Numbers are sorted descending, so that more recent corps members are at the top
              sort: 'desc',
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
      return corpsii.map((corps) => ({
        id: corps.id,
        name: corps.firstName + ' ' + corps.lastName,
        number: corps.number,
        instruments: corps.instruments.map(
          (instrument) => instrument.instrument.name,
        ),
      }));
    }),

  getMainInstrument: protectedProcedure.query(async ({ ctx }) => {
    const corps = await ctx.prisma.corps.findUnique({
      include: {
        instruments: {
          include: {
            instrument: true,
          },
        },
      },
      where: {
        userId: ctx.session?.user.id,
      },
    });
    if (!corps) {
      return null;
    }
    return corps.instruments.find((i) => i.isMainInstrument)?.instrument;
  }),

  getRole: protectedProcedure.query(async ({ ctx }) => {
    const corps = await ctx.prisma.corps.findUnique({
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
      where: {
        userId: ctx.session?.user.id,
      },
    });
    if (!corps) {
      return null;
    }
    return corps.role?.name ?? 'user';
  }),

  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const pointsQuery = await ctx.prisma.$queryRaw<{ points: number }[]>`
        SELECT SUM(points) AS points
        FROM GigSignup
        JOIN Gig ON Gig.id = GigSignup.gigId
        WHERE attended = true
        AND corpsId = ${corpsId}
      `;
    return pointsQuery?.[0]?.points ?? 0;
  }),

  setColorScheme: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { req, res } = { req: ctx.req, res: ctx.res };
      setCookie('mantine-color-scheme', input, {
        req,
        res,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 50),
      });
      return { success: true };
    }),
});
