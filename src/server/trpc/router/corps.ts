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
        },
        where: {
          userId: ctx.session?.user.id,
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
            not: ctx.session?.user.id,
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
          userId: ctx.session?.user.id,
        },
      });
      if (!corps) {
        return null;
      }
      return corps.instruments.find((i) => i.isMainInstrument)?.instrument;
    }),
});
