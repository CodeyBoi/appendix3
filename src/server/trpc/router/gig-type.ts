import { router, publicProcedure } from '../trpc';

export const gigTypeRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.gigType.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }),
});
