import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import sendVerificationRequest from "../../../utils/email-auth";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
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
                }
              },
            },
          },
        });
        session.user = userData ?? undefined;
      }
      return session;
    },
    redirect({ baseUrl }) {
      return baseUrl;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 180 * 24 * 60 * 60, // 180 days
      sendVerificationRequest,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
