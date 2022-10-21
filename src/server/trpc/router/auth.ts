import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getCorps: protectedProcedure.query(({ ctx }) => {
    const corps = prisma?.corps.findFirst({
      where: {
        userId: ctx.session?.user.id,
      },
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
      },
    });
    return corps;
  }),
});
