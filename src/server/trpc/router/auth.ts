import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  checkIfEmailInUse: publicProcedure
    .input(z.string().email("Invalid email"))
    .query(async ({ ctx, input: email }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
      return !!user;
    }),

});
