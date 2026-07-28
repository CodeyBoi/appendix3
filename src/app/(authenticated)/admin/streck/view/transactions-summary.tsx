import React from 'react';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

interface TransactionsSummaryProps {
  start?: Date;
  end?: Date;
  take?: number;
}

const TransactionsSummary = async ({
  start,
  end,
  take,
}: TransactionsSummaryProps) => {
  const transactions = await api.streck.getTransactions.query({
    start,
    end,
    take,
  });

  let sum = 0;

  const summary = transactions.items.map((item) => {
    const summary = transactions.summary[item];
    if (!summary) {
      return null;
    }
    sum += summary.totalPrice;
    return (
      <tr key={item} className='divide-x divide-solid dark:divide-neutral-800'>
        <td className='px-2'>{item}</td>
        <td className='px-2 text-right'>{summary.amount}</td>
        <td className='px-2 text-right'>{summary.totalPrice}</td>
      </tr>
    );
  });

  return (
    <div className='flex max-w-min flex-col gap-2'>
      <h5>
        {lang('Summa:', 'Sum:')} {sum}
      </h5>
      <table className='table text-sm'>
        <thead>
          <tr className='text-left'>
            <th className='px-1'>{lang('Artikel', 'Item')}</th>
            <th className='px-1'>{lang('Antal', 'Amount')}</th>
            <th className='px-1'>{lang('Totalpris', 'Total price')}</th>
          </tr>
        </thead>
        <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
          {summary}
        </tbody>
      </table>
    </div>
  );
};
export default TransactionsSummary;
