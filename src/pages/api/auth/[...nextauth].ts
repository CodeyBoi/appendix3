import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

// Prisma adapter for NextAuth, optional and can be removed
//import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { test } from '../../../utils/test';
import { prisma } from '../../../server/db/client';
import sendVerificationRequest from '../../../utils/email-auth';
import { createHash, randomBytes } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

const GenerateToken = () => {
  const unhashedToken = randomBytes(32).toString('hex');
  return unhashedToken;
};

export const HashToken = (token: string) => {
  return createHash('sha256')
    .update(`${token + process.env.NEXTAUTH_SECRET}`)
    .digest('hex');
};

// const GeneratePages = (token?: string) => {
//   return {
//     signIn: '/login',
//     verifyRequest: `/verify-request?token=${HashToken(
//       token ?? '' + process.env.NEXTAUTH_SECRET
//     )}`,
//   };
// };

let _token = '';
// let _pages = GeneratePages();

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
    adapter: test(prisma),
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 180 * 24 * 60 * 60, // 180 days
        sendVerificationRequest,
        async generateVerificationToken() {
          try {
            _token = GenerateToken();
            res.setHeader('Set-Cookie', `token=${_token};Path=/`);
            return _token;
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
