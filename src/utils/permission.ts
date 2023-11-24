// Defines the permissions that can be assigned to a corps or role.
// NOTE: Keep this in sync with the permissions in the database!
export const ALL_PERMISSIONS = [
  'manageGigs',
  'managePermissions',
  'manageCorps',
  'manageRehearsals',
  'manageKiller',
  'manageSections',
  'viewFoodPrefs',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];
