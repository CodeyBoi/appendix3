import { IconTablePlus } from '@tabler/icons-react';
import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import dayjs from 'dayjs';
import React from 'react';
import { api } from 'trpc/server';

const AdminStreckPage = async () => {
  const transactions = await api.streck.getTransactions.query({});

  return (
    <div className='flex flex-row-reverse gap-4'>
      <div className='flex gap-2 flex-col'>
        <Button href='streck/new'>
          <IconTablePlus />
          Skapa ny strecklista...
        </Button>
      </div>
      <table className='table text-sm flex-grow'>
        <thead>
          <tr className='text-left'>
            <th className='px-1'>Tid</th>
            <th className='px-1'>Corps</th>
            <th className='px-1'>Artikel</th>
            <th className='px-1'>Styckpris</th>
            <th className='px-1'>Antal</th>
            <th className='px-1'>Total</th>
          </tr>
        </thead>
        <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className='divide-x divide-solid dark:divide-neutral-800'
            >
              <td className='px-1'>
                {dayjs(transaction.time).format('YYYY-MM-DD HH:mm')}
              </td>
              <td className='px-1'>
                <CorpsDisplay corps={transaction.corps} />
              </td>
              <td className='px-1'>{transaction.item}</td>
              <td className='px-1'>{-transaction.pricePer}</td>
              <td className='px-1'>{transaction.amount}</td>
              <td className='px-1'>{-transaction.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStreckPage;
