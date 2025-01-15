import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from 'server/db/client';
import { GenerateToken } from 'server/utils/token';
import { CustomPrismaAdapter } from 'utils/CustomPrismaAdapter';
import sendVerificationRequest from 'utils/email-auth';

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse,
) => NextAuthOptions;

export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn() {
      const isAllowedToSignIn = true; //! ... determine if user is allowed to sign in?
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user }) {
      if (session.user) {
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            corps: {
              select: {
                id: true,
                roles: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
        session.user = userData ?? undefined;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 180 * 24 * 60 * 60, // 180 days
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: `/verify-request`,
  },
};

export const authOptionsCallback: NextAuthOptionsCallback = (_req, res) => {
  return {
    ...authOptions,
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 180 * 24 * 60 * 60, // 180 days
        sendVerificationRequest,
        generateVerificationToken() {
          try {
            const token = GenerateToken();
            res.setHeader('Set-Cookie', `unverifiedToken=${token};Path=/`);

            return token;
          } catch (error) {
            throw Error(JSON.stringify(error));
          }
        },
      }),
    ],
  };
};

const defaultExport = (req: NextApiRequest, res: NextApiResponse) =>
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  NextAuth(req, res, authOptionsCallback(req, res));
/* eslint-enable @typescript-eslint/no-unsafe-return */
export default defaultExport;
