import { CorpsFoodPrefs } from '@prisma/client';
import { setCookie } from 'cookies-next';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { adminProcedure } from './../trpc';

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
        userId: ctx.session?.user.id || '',
      },
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const corpsQuery = ctx.prisma.corps.findUnique({
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
      const pointsQuery = ctx.prisma.gig.aggregate({
        _sum: {
          points: true,
        },
        where: {
          signups: {
            some: {
              corpsId: input.id,
              attended: true,
            },
          },
        },
      });
      const [corps, points] = await Promise.all([corpsQuery, pointsQuery]);
      if (!corps) {
        return null;
      }
      return {
        ...corps,
        points: points._sum.points ?? 0,
      };
    }),

  updateSelf: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        nickName: z.string(),
        email: z.string(),
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
          userId: ctx.session?.user.id || '',
        },
      });

      if (corps === null) {
        throw new Error('Not logged in');
      }

      const foodPrefs = {
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
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          nickName:
            input.nickName.trim().length > 0 ? input.nickName.trim() : null,
          user: {
            update: {
              email: input.email.trim(),
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
        nickName: z.string(),
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
        nickName:
          input.nickName.trim().length > 0 ? input.nickName.trim() : null,
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
              nickName: {
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
          nickName: true,
          fullName: true,
          displayName: true,
          number: true,
          instruments: {
            select: {
              isMainInstrument: true,
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
        firstName: corps.firstName,
        lastName: corps.lastName,
        nickName: corps.nickName,
        fullName: corps.fullName,
        displayName: corps.displayName,
        number: corps.number,
        mainInstrument: corps.instruments.find((i) => i.isMainInstrument)
          ?.instrument.name,
        otherInstruments: corps.instruments
          .filter((i) => !i.isMainInstrument)
          .map((instrument) => instrument.instrument.name),
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
      setCookie('tw-color-scheme', input, {
        req,
        res,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 50),
      });
      return { success: true };
    }),

  getFoodPreferences: adminProcedure
    .input(z.object({ corpsIds: z.string().or(z.array(z.string())) }))
    .query(async ({ ctx, input }) => {
      const corpsIds = Array.isArray(input.corpsIds)
        ? input.corpsIds
        : [input.corpsIds];
      const corps = await ctx.prisma.corps.findMany({
        where: {
          id: {
            in: corpsIds,
          },
        },
        include: {
          foodPrefs: true,
        },
      });
      return corps.reduce(
        (acc, corps) => {
          if (!corps.foodPrefs) {
            return acc;
          }
          acc[corps.id] = corps.foodPrefs;
          return acc;
        },
        {} as Record<string, CorpsFoodPrefs>,
      );
    }),
});
