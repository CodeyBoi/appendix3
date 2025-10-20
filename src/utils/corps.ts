import { Prisma } from '@prisma/client';

export const displayName = (
  corps:
    | {
        firstName: string;
        lastName: string;
        nickName: string | null;
        number: number | null;
        bNumber: number | null;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : `${displayNumber(corps)} ${
        corps.nickName ? corps.nickName.trim() : fullName(corps)
      }`;

export const detailedName = (
  corps:
    | {
        firstName: string;
        lastName: string;
        nickName: string | null;
        number: number | null;
        bNumber: number | null;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : `${displayNumber(corps)} ${corps.firstName.trim()}${
        corps.nickName ? ` "${corps.nickName.trim()}"` : ''
      } ${corps.lastName.trim()}`;

export const displayNumber = (
  corps:
    | {
        number: number | null;
        bNumber: number | null;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : corps.number
    ? `#${corps.number}`
    : corps.bNumber
    ? `b${corps.bNumber}`
    : 'p.e.';

export const numberAndFullName = (
  corps:
    | {
        firstName: string;
        lastName: string;
        number: number | null;
        bNumber: number | null;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : `${displayNumber(corps)} ${fullName(corps)}`;

export const fullName = (
  corps:
    | {
        firstName: string;
        lastName: string;
      }
    | null
    | undefined,
) =>
  corps === null || corps === undefined
    ? ''
    : corps.firstName.trim() + ' ' + corps.lastName.trim();

interface CorpsSort {
  number: number | null;
  bNumber: number | null;
  lastName: string;
  firstName: string;
}

export const sortCorps = (a: CorpsSort, b: CorpsSort) => {
  if (a.number && b.number) {
    return a.number - b.number;
  } else if (a.number && !b.number) {
    return -1;
  } else if (!a.number && b.number) {
    return 1;
  } else if (a.bNumber && b.bNumber) {
    return a.bNumber - b.bNumber;
  } else if (a.bNumber && !b.bNumber) {
    return -1;
  } else if (!a.bNumber && b.bNumber) {
    return 1;
  } else if (a.lastName !== b.lastName) {
    return a.lastName.localeCompare(b.lastName, 'sv');
  }
  return a.firstName.localeCompare(b.firstName, 'sv');
};

export const sortCorpsByName = (a: CorpsSort, b: CorpsSort) => {
  const lastName = a.lastName.localeCompare(b.lastName, 'sv');
  if (lastName !== 0) {
    return lastName;
  }
  const firstName = a.firstName.localeCompare(b.firstName, 'sv');
  if (firstName !== 0) {
    return firstName;
  } else if (a.number && !b.number) {
    return -1;
  } else if (!a.number && b.number) {
    return 1;
  } else if (a.bNumber && !b.bNumber) {
    return -1;
  } else if (!a.bNumber && b.bNumber) {
    return 1;
  }
  return (a.number ?? 0x516) - (b.number ?? 0x516);
};

export const corpsOrderBy = [
  {
    number: {
      sort: 'asc',
      nulls: 'last',
    },
  },
  {
    bNumber: {
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
    bNumber: {
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
