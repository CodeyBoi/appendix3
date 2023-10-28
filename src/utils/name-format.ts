export const detailedName = (corps: {
  firstName: string;
  lastName: string;
  nickName: string | null;
  number: number | null;
}) =>
  `${corps.number ? `#${corps.number}` : 'p.e.'} ${corps.firstName}${
    corps.nickName ? ` "${corps.nickName}"` : ''
  } ${corps.lastName}`;
