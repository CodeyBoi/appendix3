import NextAuth, { type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { CustomPrismaAdapter } from '../../../utils/CustomPrismaAdapter';
import { prisma } from '../../../server/db/client';
import sendVerificationRequest from '../../../utils/email-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { GenerateToken } from '../../../server/utils/token';

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse,
) => NextAuthOptions;

export const authOptions: NextAuthOptionsCallback = (req, res) => {
  return {
    callbacks: {
      async signIn() {
        const isAllowedToSignIn = true; //! ... determine if user is allowed to sign in?
        if (isAllowedToSignIn) {
          return true;
        } else {
          return false;
        }
      },
      async redirect({ url, baseUrl }) {
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
            // eslint-disable-next-line
          } catch (error: any) {
            throw Error(error);
          }
        },
      }),
    ],
    pages: {
      signIn: '/login',
      verifyRequest: `/verify-request`,
    },
  };
};

// eslint-disable-next-line
export default (req: NextApiRequest, res: NextApiResponse) => {
  NextAuth(req, res, authOptions(req, res));
};
