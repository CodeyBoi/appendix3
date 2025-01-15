import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { ALL_PERMISSIONS, Permission } from 'utils/permission';
import { corpsOrderBy } from 'utils/corps';

interface PermissionEntry {
  id: number;
  name: Permission;
}

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
    return new Set(
      permissions.map((permission) => permission.name),
    ) as Set<Permission>;
  }),

  getCorpsPermissions: restrictedProcedure('managePermissions').query(
    async ({ ctx }) => {
      const corpsPermissions = await ctx.prisma.corps.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          number: true,
          bNumber: true,
          nickName: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          permissions: {
            some: {
              name: {
                in: ALL_PERMISSIONS.map((permission) => permission),
              },
            },
          },
        },
        orderBy: corpsOrderBy,
      });
      return corpsPermissions;
    },
  ),

  getRole: restrictedProcedure('managePermissions')
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const role = await ctx.prisma.role.findUnique({
        where: { id: input.id },
        include: {
          permissions: {
            orderBy: {
              name: 'asc',
            },
          },
          corpsii: {
            orderBy: corpsOrderBy,
          },
        },
      });

      if (!role) {
        throw new Error('Role not found');
      }

      return {
        ...role,
        permissions: role.permissions as PermissionEntry[],
      };
    }),

  getRoles: restrictedProcedure('managePermissions').query(async ({ ctx }) => {
    const roles = await ctx.prisma.role.findMany({
      include: {
        permissions: {
          orderBy: {
            name: 'asc',
          },
        },
        corpsii: {
          orderBy: corpsOrderBy,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return roles.map((role) => ({
      ...role,
      permissions: role.permissions as PermissionEntry[],
    }));
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
            set: input.permissions.map((permission) => ({
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
