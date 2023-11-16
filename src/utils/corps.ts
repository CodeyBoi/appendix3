export const detailedName = (
  corps:
    | {
        firstName: string;
        lastName: string;
        nickName: string | null;
        number: number | null;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : `${corps.number ? `#${corps.number}` : 'p.e.'} ${corps.firstName}${
        corps.nickName ? ` "${corps.nickName}"` : ''
      } ${corps.lastName}`;

type CorpsSort = {
  number: number | null;
  lastName: string;
  firstName: string;
};

export const sortCorps = (a: CorpsSort, b: CorpsSort) => {
  if (a.number && b.number) {
    return a.number - b.number;
  } else if (a.number && !b.number) {
    return -1;
  } else if (!a.number && b.number) {
    return 1;
  } else if (a.lastName !== b.lastName) {
    return a.lastName.localeCompare(b.lastName);
  }
  return a.firstName.localeCompare(b.firstName);
};
