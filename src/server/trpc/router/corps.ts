import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const corpsRouter = router({
  getCorps: protectedProcedure
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
        },
        where: {
          userId: ctx.session?.user.id || undefined,
        },
      });
    }),

  update: protectedProcedure
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

  getCorpsii: protectedProcedure
    .query(async ({ ctx }) => {
      const corpsii = await ctx.prisma.corps.findMany({
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
        where: {
          userId: {
            not: ctx.session?.user.id || undefined,
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

  getRole: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.corps.findUnique({
        include: {
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
      return user?.role?.name ?? "user";
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
