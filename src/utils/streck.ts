import { StreckList } from 'server/trpc/router/streck';

export const getStreckListType = (transactions: StreckList['transactions']) =>
  new Set(transactions.map((t) => t.item)).size !== 1
    ? 'strecklist'
    : transactions.every((t) => t.pricePer < 0)
    ? 'cost'
    : transactions.every((t) => t.pricePer > 0)
    ? 'deposit'
    : 'unknown';
