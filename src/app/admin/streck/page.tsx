import { IconCoins } from '@tabler/icons-react';
import { IconTablePlus } from '@tabler/icons-react';
import Button from 'components/input/button';
import dayjs from 'dayjs';
import React from 'react';
import { api } from 'trpc/server';

const AdminStreckPage = async () => {
  const transactions = await api.streck.getTransactions.query({});

  return (
    <div className='flex flex-row-reverse'>
      <div className='flex gap-2 flex-col'>
        <Button href='streck/new'>
          <IconTablePlus />
          Ny strecklista
        </Button>
        <Button href='/admin/streck/deposit'>
          <IconCoins />
          Ny insättning
        </Button>
      </div>
      <div className='flex grow flex-col'>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            {`${dayjs(transaction.time).format('YYYY-MM-DD HH:mm')}: ${transaction.corps.fullName} streckade ${
              transaction.amount
            } st ${transaction.item.toLowerCase()} för ${-transaction.pricePer}p var, totalt ${-transaction.totalPrice}p.`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStreckPage;
