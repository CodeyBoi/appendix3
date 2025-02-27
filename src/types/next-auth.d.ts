import { DefaultSession as _DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user?: {
    //   id: string;
    // } & DefaultSession["user"];
    user?:
      | ({ id: string; email: string | null } & {
          corps: {
            id: string;
            roles:
              | {
                  name: string;
                }[]
              | null;
          } | null;
        })
      | null;
    // & DefaultSession["user"]
  }
}
