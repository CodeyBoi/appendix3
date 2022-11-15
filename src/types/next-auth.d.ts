import { Corps, Prisma, User } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user?: {
    //   id: string;
    // } & DefaultSession["user"];
    user?: { id: string | null, email: string | null } & { corps: { id: number, role: { name: string } | null } | null } | null
    // & DefaultSession["user"]
    ;
  }
}

