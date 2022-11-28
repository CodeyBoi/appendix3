import { adminProcedure } from './../trpc';
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const corpsRouter = router({
  getSelf: protectedProcedure
    .query(async ({ ctx }) => {
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
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      drinksAlcohol: z.boolean(),
      vegetarian: z.boolean(),
      vegan: z.boolean(),
      glutenIntolerant: z.boolean(),
      lactoseIntolerant: z.boolean(),
      otherFoodRestrictions: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const corps = await ctx.prisma.corps.findUnique({
        where: {
          userId: ctx.session?.user.id || undefined,
        },
      });

      if (corps === null) {
        throw new Error("Not logged in");
      }

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
          drinksAlcohol: input.drinksAlcohol,
          vegetarian: input.vegetarian,
          vegan: input.vegan,
          glutenIntolerant: input.glutenIntolerant,
          lactoseIntolerant: input.lactoseIntolerant,
          otherFoodRestrictions: input.otherFoodRestrictions,
        },
      });
    }),

  upsert: adminProcedure
    .input(z.object({
      id: z.string().optional(),
      firstName: z.string(),
      lastName: z.string(),
      number: z.number().nullable(),
      bNumber: z.number().nullable(),
      email: z.string(),
      mainInstrument: z.string(),
      otherInstruments: z.array(z.string()),
      role: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.otherInstruments.includes(input.mainInstrument)) {
        throw new Error("Main instrument cannot be in other instruments");
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
                instrumentId: instruments.find((instrument) => instrument.name === input.mainInstrument)?.id ?? 19,
                isMainInstrument: true,
              },
              ...input.otherInstruments.map((instrument) => ({
                instrumentId: instruments.find((i) => i.name === instrument)?.id ?? 19,
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
          id: input.id,

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
            create: {
              email: input.email,
            },
          },
        },
      });
    }),

  getMany: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      role: z.string().optional(),
      instrument: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const number = parseInt(input.search ?? "");
      const bNumber = parseInt(input.search ?? "");
      const corpsii = await ctx.prisma.corps.findMany({
        where: {
          userId: {
            not: ctx.session?.user.id || undefined,
          },
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
      });
      return corpsii.map((corps) => ({
        id: corps.id,
        name: corps.firstName + " " + corps.lastName,
        number: corps.number,
        instruments: corps.instruments.map((instrument) => instrument.instrument.name),
      }));
    }),

  mainInstrument: protectedProcedure
    .query(async ({ ctx }) => {
      const corps = await ctx.prisma.corps.findUnique({
        include: {
          instruments: {
            include: {
              instrument: true,
            },
          },
        },
        where: {
          userId: ctx.session?.user.id || undefined,
        },
      });
      if (!corps) {
        return null;
      }
      return corps.instruments.find((i) => i.isMainInstrument)?.instrument;
    }),
});
