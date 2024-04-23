// Defines the permissions that can be assigned to a corps or role.
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
  'addBingoEntry',
] as const;
export type Permission = (typeof ALL_PERMISSIONS)[number];
