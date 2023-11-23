import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';

// Defines the permissions that can be assigned to a corps or role.
// NOTE: Keep this in sync with the permissions in the database!
export const ALL_PERMISSIONS = [
  'manageGigs',
  'managePermissions',
  'manageCorps',
  'viewFoodPrefs',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

const allowedOrigins = ['localhost:3000', 'bleckhornen.org'];

const allowCors = t.middleware(({ ctx, next }) => {
  const origin = ctx.req.headers.origin ?? '';
  if (allowedOrigins.some((o) => origin.endsWith(o))) {
    ctx.res.setHeader('Access-Control-Allow-Origin', origin);
  }
  return next();
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure.use(allowCors);

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  const user = ctx.session?.user;
  const corps = ctx.session?.user?.corps;
  if (!ctx.session || !user || !corps) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
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
 * Reusable middleware to make sure user has the relevant permissions
 */
const withPermissions = (permissions: Permission[] | Permission) =>
  t.middleware(async ({ ctx, next }) => {
    const user = ctx.session?.user;
    const corps = user?.corps;
    if (!ctx.session || !user || !corps) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const corpsPermissions = await ctx.prisma.permission.findMany({
      where: {
        OR: [
          {
            corpsii: {
              some: {
                id: corps.id,
              },
            },
          },
          {
            roles: {
              some: {
                corpsii: {
                  some: {
                    id: corps.id,
                  },
                },
              },
            },
          },
        ],
      },
    });

    const permissionsSet = new Set(
      corpsPermissions.map((permission) => permission.name),
    );
    const neededPermissions = Array.isArray(permissions)
      ? permissions
      : [permissions];
    const missingPermissions = neededPermissions.filter(
      (permission) => !permissionsSet.has(permission),
    );

    if (missingPermissions.length > 0) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Missing permissions`,
      });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: {
          ...ctx.session,
          user: { ...ctx.session.user, corps, permissions: permissionsSet },
        },
      },
    });
  });

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Procedure that requires certain permissions
 **/
export const restrictedProcedure = (permissions: Permission[] | Permission) =>
  t.procedure.use(withPermissions(permissions));
