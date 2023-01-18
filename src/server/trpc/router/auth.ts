import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { HashToken } from '../../../pages/api/auth/[...nextauth]';

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  checkIfEmailInUse: publicProcedure
    .input(z.string().email('Invalid email'))
    .query(async ({ ctx, input: email }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
      return !!user;
    }),

  checkVerified: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: token }) => {
      console.log(token);
      const hashedToken = HashToken(token);
      const verifiedtoken = await ctx.prisma.verifiedToken.findUnique({
        where: { token: hashedToken },
      });

      signIn;

      console.log(verifiedtoken);
      return !!verifiedtoken;
    }),
});
