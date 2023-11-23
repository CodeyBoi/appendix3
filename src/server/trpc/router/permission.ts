import { z } from 'zod';
import {
  router,
  restrictedProcedure,
  ALL_PERMISSIONS,
  protectedProcedure,
} from '../trpc';

export const permissionRouter = router({
  getOwnPermissions: protectedProcedure.query(async ({ ctx }) => {
    const corpsId = ctx.session.user.corps.id;
    const permissions = await ctx.prisma.permission.findMany({
      where: {
        OR: [
          {
            corpsii: {
              some: {
                id: corpsId,
              },
            },
          },
          {
            roles: {
              some: {
                corpsii: {
                  some: {
                    id: corpsId,
                  },
                },
              },
            },
          },
        ],
      },
    });
    return new Set(permissions.map((permission) => permission.name));
  }),

  getRoles: restrictedProcedure('managePermissions').query(async ({ ctx }) => {
    const roles = await ctx.prisma.role.findMany({});
    return roles;
  }),

  upsertRole: restrictedProcedure('managePermissions')
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        permissions: z.array(z.enum(ALL_PERMISSIONS)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.prisma.role.upsert({
        where: { id: input.id ?? -1 },
        update: {
          name: input.name,
          permissions: {
            connect: input.permissions.map((permission) => ({
              name: permission,
            })),
          },
        },
        create: {
          name: input.name,
          permissions: {
            connect: input.permissions.map((permission) => ({
              name: permission,
            })),
          },
        },
      });
      return role;
    }),

  deleteRole: restrictedProcedure('managePermissions')
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.prisma.role.delete({
        where: { id: input.id },
      });
      return role;
    }),
});
