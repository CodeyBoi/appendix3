import React from 'react';
import { api } from 'trpc/server';

type TransactionsSummaryProps = {
  start?: Date;
  end?: Date;
  take?: number;
};

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

  return (
    <div>
      <table className='table text-sm'>
        <thead>
          <tr className='text-left'>
            <th className='px-1'>Artikel</th>
            <th className='px-1'>Antal</th>
            <th className='px-1'>Totalpris</th>
          </tr>
        </thead>
        <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
          {transactions.items.map((item) => {
            const summary = transactions.summary[item];
            if (!summary) {
              return null;
            }
            return (
              <tr
                key={item}
                className='divide-x divide-solid dark:divide-neutral-800'
              >
                <td className='px-2'>{item}</td>
                <td className='px-2 text-right'>{summary.amount}</td>
                <td className='px-2 text-right'>{summary.totalPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default TransactionsSummary;
