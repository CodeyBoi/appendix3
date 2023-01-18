import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { randomUUID } from 'crypto';
import { AdapterSession } from 'next-auth/adapters';
import { HashToken } from '../../utils/CHW';

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
      const hashedToken = HashToken(token);
      const verifiedtoken = await ctx.prisma.verifiedToken.findUnique({
        where: { token: hashedToken },
      });

      if (!!verifiedtoken) {
        await ctx.prisma.verifiedToken.delete({
          where: { token: hashedToken },
        });

        const user = await ctx.prisma.user.findUnique({
          where: { email: verifiedtoken.identifier },
        });

        const data = {
          sessionToken: randomUUID(),
          userId: user!.id,
          expires: new Date(new Date().setDate(new Date().getDate() + 1)),
        };

        const session = await ctx.prisma.session.create({ data });

        const secure = ctx.req.headers['x-forwarded-proto'] ?? false;
        const cookiePrefix = secure ? '__Secure-' : '';
        ctx.res.setHeader(
          'Set-Cookie',
          `${cookiePrefix}next-auth.session-token=${
            session.sessionToken ?? ''
          }; Path=/; SameSite=lax; HttpOnly; ${secure ? 'Secure;' : ''}; `,
        );
        return true;
      }
      return null;
    }),
});
