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
