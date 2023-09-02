export const newUTCDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
