import { CorpsFoodPrefs } from '@prisma/client';
import { z } from 'zod';
import { protectedProcedure, restrictedProcedure, router } from '../trpc';
import { corpsOrderByNumberDesc } from 'utils/corps';

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
        roles: {
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
          roles: {
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
        nickName: z.string(),
        email: z.string(),
        vegetarian: z.boolean(),
        vegan: z.boolean(),
        glutenFree: z.boolean(),
        lactoseFree: z.boolean(),
        otherFoodPrefs: z.string().optional(),
        mainInstrument: z.string().optional(),
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

      // Update main instrument (set all to false, then set main instrument to true)
      if (input.mainInstrument) {
        const instruments = await ctx.prisma.instrument.findMany({});
        const mainInstrument = instruments.find(
          (instrument) => instrument.name === input.mainInstrument,
        );
        if (!mainInstrument) {
          throw new Error('Invalid instrument');
        }
        const mainInstrumentId = mainInstrument.id;
        await ctx.prisma.corpsInstrument.updateMany({
          where: {
            corpsId: corps.id,
          },
          data: {
            isMainInstrument: false,
          },
        });
        await ctx.prisma.corpsInstrument.update({
          where: {
            corpsId_instrumentId: {
              corpsId: corps.id,
              instrumentId: mainInstrumentId,
            },
          },
          data: {
            isMainInstrument: true,
          },
        });
      }

      return ctx.prisma.corps.update({
        where: {
          id: corps.id,
        },
        data: {
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

  upsert: restrictedProcedure('manageCorps')
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
        roles: z.array(z.string()),
        language: z.enum(['sv', 'en']),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.otherInstruments.includes(input.mainInstrument)) {
        throw new Error('Main instrument cannot be in other instruments');
      }
      const instruments = await ctx.prisma.instrument.findMany({});
      const queryData = {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
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
        roles: {
          connect: input.roles.map((role) => ({
            name: role,
          })),
        },
        language: input.language,
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
              roles: {
                some: {
                  name: {
                    contains: input.role,
                  },
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
        orderBy: corpsOrderByNumberDesc,
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

  getRoles: protectedProcedure.query(async ({ ctx }) => {
    const corps = await ctx.prisma.corps.findUnique({
      select: {
        roles: {
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
    return corps.roles.map((role) => role.name);
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
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      await ctx.prisma.corps.update({
        where: {
          id: corpsId,
        },
        data: {
          colorScheme: input,
        },
      });
      return { success: true };
    }),

  getFoodPreferences: restrictedProcedure('viewFoodPrefs')
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

  getLanguage: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const corps = await ctx.prisma.corps.findUnique({
      where: {
        id: corpsId,
      },
      select: {
        language: true,
      },
    });
    return corps?.language ?? 'sv';
  }),

  setLanguage: protectedProcedure
    .input(z.enum(['sv', 'en']))
    .mutation(async ({ ctx, input }) => {
      const corpsId = ctx.session.user.corps.id;
      await ctx.prisma.corps.update({
        where: {
          id: corpsId,
        },
        data: {
          language: input,
        },
      });
      return { success: true };
    }),

  addRole: restrictedProcedure('managePermissions')
    .input(
      z.object({
        corpsId: z.string(),
        roleId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.corps.update({
        where: {
          id: input.corpsId,
        },
        data: {
          roles: {
            connect: {
              id: input.roleId,
            },
          },
        },
      });
      return { success: true };
    }),

  removeRole: restrictedProcedure('managePermissions')
    .input(
      z.object({
        corpsId: z.string(),
        roleId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.corps.update({
        where: {
          id: input.corpsId,
        },
        data: {
          roles: {
            disconnect: {
              id: input.roleId,
            },
          },
        },
      });
      return { success: true };
    }),
});
