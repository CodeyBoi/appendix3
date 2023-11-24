import { z } from 'zod';
import { router, restrictedProcedure, protectedProcedure } from '../trpc';
import { ALL_PERMISSIONS, Permission } from 'utils/permission';

type Role = {
  id: number;
  name: string;
  permissions: { id: number; name: Permission }[];
};

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
        },
      });

      if (!role) {
        throw new Error('Role not found');
      }

      return role as Role;
    }),

  getRoles: restrictedProcedure('managePermissions').query(async ({ ctx }) => {
    const roles = await ctx.prisma.role.findMany({
      include: {
        permissions: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return roles as Role[];
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
      return role as Role;
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
      return role as Role;
    }),
});
