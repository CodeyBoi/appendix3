// Defines the permissions that can be assigned to a corps or role.

import { Context } from 'server/trpc/context';

// NOTE: Keep this in sync with the permissions in the database!
export const ALL_PERMISSIONS = [
  'manageGigs',
  'manageAttendance',
  'managePermissions',
  'manageCorps',
  'manageRehearsals',
  'manageKiller',
  'manageSections',
  'viewFoodPrefs',
  'manageStreck',
  'viewStreck',
  'viewAttendance',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];

export const addNewPermissions = async (ctx: Context) => {
  const existingPermissions = (await ctx.prisma.permission.findMany()).map(
    (p) => p.name,
  );

  for (const permission of ALL_PERMISSIONS) {
    if (!existingPermissions.includes(permission)) {
      await ctx.prisma.permission.create({
        data: {
          name: permission,
        },
      });
    }
  }
};
