import { router, publicProcedure } from '../trpc';

export const instrumentRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.instrument.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }),
});
