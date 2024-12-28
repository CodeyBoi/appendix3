import React from 'react';
import dayjs from 'dayjs';
import { api } from 'trpc/server';

const OwnTransactionsTable = async () => {
  const account = await api.streck.getOwnStreckAccount.query({});

  if (account.transactions.length === 0) {
    return null;
  }

  return (
    <div>
      <table className='table text-sm'>
        <thead>
          <tr className='text-left'>
            <th className='px-1'>Datum</th>
            <th className='px-1'>Artikel</th>
            <th className='px-1'>Styckpris</th>
            <th className='px-1'>Antal</th>
            <th className='px-1'>Total</th>
            <th className='px-1'>Saldo</th>
          </tr>
        </thead>
        <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
          {account.transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className='divide-x divide-solid dark:divide-neutral-800'
            >
              <td className='px-2'>
                {dayjs(transaction.time).format('YYYY-MM-DD')}
              </td>
              <td className='px-2'>{transaction.item}</td>
              <td className='px-2 text-right'>{transaction.pricePer}</td>
              <td className='px-2 text-right'>{transaction.amount}</td>
              <td className='px-2 text-right'>{transaction.totalPrice}</td>
              <td className='px-2 text-right'>{transaction.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnTransactionsTable;
