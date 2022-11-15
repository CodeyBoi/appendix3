import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

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
    redirect({ url, baseUrl }) {
      return baseUrl;
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 180 * 24 * 60 * 60, // 180 days
      // sendVerificationRequest({ identifier: email, url, provider: { server, from }) {
      //   const transport = createTransport(server);
    }),
    // ...add more providers here
  ],
  // pages: {
  //   signIn: "/auth/login",
  //   newUser: "/auth/new-user",
  // },
};

export default NextAuth(authOptions);
