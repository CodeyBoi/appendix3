import { Prisma } from '@prisma/client';

export const displayName = (
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
    : `${corps.number ? `#${corps.number}` : 'p.e.'} ${
        corps.nickName ? corps.nickName : corps.firstName + ' ' + corps.lastName
      }`;

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

export const numberAndFullName = (
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
    : `${corps.number ? `#${corps.number}` : 'p.e.'} ${
        corps.firstName + ' ' + corps.lastName
      }`;

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

export const corpsOrderBy = [
  {
    number: {
      sort: 'asc',
      nulls: 'last',
    },
  },
  {
    lastName: 'asc',
  },
  {
    firstName: 'asc',
  },
] as Prisma.CorpsOrderByWithRelationInput[];

export const corpsOrderByNumberDesc = [
  {
    number: {
      // Numbers are sorted descending, so that more recent corps members are at the top
      sort: 'desc',
      nulls: 'last',
    },
  },
  {
    lastName: 'asc',
  },
  {
    firstName: 'asc',
  },
] as Prisma.CorpsOrderByWithRelationInput[];
