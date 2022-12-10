import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  const user = ctx.session?.user;
  const corps = ctx.session?.user?.corps;
  if (!ctx.session || !user || !corps) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: { ...ctx.session.user, corps },
      },
    },
  });
});

/**
 * Reusable middleware to ensure
 * user is admin
 */
const isAdmin = t.middleware(async ({ ctx, next }) => {
  const user = ctx.session?.user;
  const corps = ctx.session?.user?.corps;
  if (!ctx.session || !user || !corps || corps.role?.name !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: {
        ...ctx.session,
        user: { ...ctx.session.user, corps },
      },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Admin procedure
 **/
export const adminProcedure = t.procedure.use(isAdmin);
