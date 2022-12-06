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
  if (!ctx.session || !ctx.session.user || !ctx.session.user.corps?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Reusable middleware to ensure
 * user is admin
 */
const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const role = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id || "" },
    select: {
      corps: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (role?.corps?.role?.name !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
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
