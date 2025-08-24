import React, { Fragment } from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import dayjs from 'dayjs';
import { Language } from 'hooks/use-language';

type StreckAccount = NonNullable<
  Awaited<ReturnType<typeof api.streck.getStreckAccount.query>>
>;
type Transaction = StreckAccount['transactions'][number];

interface TransactionsTableProps {
  locale?: Language;
  transactions: Transaction[];
}

const TransactionsTable = ({
  locale = 'sv',
  transactions,
}: TransactionsTableProps) => {
  if (transactions.length === 0) {
    return (
      <h3 className='italic'>{lang('Här var det tomt...', 'How empty..')}</h3>
    );
  }

  let lastMonth: number;
  return (
    <div className='flex max-w-sm flex-col divide-y divide-solid dark:divide-neutral-800'>
      {transactions.map((transaction) => {
        const month = transaction.time.getMonth();
        const shouldAddMonth = lastMonth !== month;
        lastMonth = month;
        return (
          <Fragment key={transaction.id}>
            {shouldAddMonth && (
              <h3 className='pt-2 capitalize'>
                {transaction.time.toLocaleString(locale, {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
            )}
            <div className='flex flex-col text-lg'>
              <div className='flex justify-between'>
                <div className='grow text-ellipsis'>{transaction.item}</div>
                <div
                  className={
                    transaction.totalPrice > 0
                      ? 'text-green-700'
                      : 'text-red-700'
                  }
                >
                  {transaction.totalPrice}
                </div>
              </div>
              <div className='flex justify-between text-xs font-thin'>
                <div className='grow'>
                  {dayjs(transaction.time).format('YYYY-MM-DD')}
                </div>
                <div>{transaction.balance}</div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default TransactionsTable;
