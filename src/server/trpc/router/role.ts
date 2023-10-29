import { router, publicProcedure } from '../trpc';

export const roleRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.role.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }),
});
