import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// Prisma adapter for NextAuth, optional and can be removed
//import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { CustomPrismaAdapter } from '../../../utils/CustomPrismaAdapter';
import { prisma } from '../../../server/db/client';
import sendVerificationRequest from '../../../utils/email-auth';
import { createHash, randomBytes } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { GenerateToken } from '../../../server/utils/CHW';

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

export const authOptions: NextAuthOptionsCallback = (req, res) => {
  return {
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const isAllowedToSignIn = true;
        if (isAllowedToSignIn) {
          return true;
        } else {
          return false;
        }
      },
      async redirect({ url, baseUrl }) {
        if (url.includes('login')) {
          console.log(url);
        }

        // Allows relative callback URLs
        if (url.startsWith('/')) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
      async session({ session, token, user }) {
        if (session.user) {
          const userData = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              email: true,
              corps: {
                select: {
                  id: true,
                  role: {
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
        async generateVerificationToken() {
          try {
            const token = GenerateToken();
            res.setHeader('Set-Cookie', `unverifiedToken=${token};Path=/`);

            return token;
          } catch (error: any) {
            console.log(error);
            throw Error(error);
          }
        },
      }),
      // ...add more providers here
    ],
    //_pages,
    pages: {
      signIn: '/login',
      verifyRequest: `/verify-request`,
    },
  };
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  NextAuth(req, res, authOptions(req, res));
};
