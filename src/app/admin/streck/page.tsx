import { IconCoins, IconDownload, IconTablePlus } from '@tabler/icons-react';
import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import dayjs from 'dayjs';
import React from 'react';
import { api } from 'trpc/server';
import { displayName } from 'utils/corps';

const AdminStreckPage = async () => {
  const [transactions, activeCorps, items] = await Promise.all([
    api.streck.getTransactions.query({}),
    api.streck.getActiveCorps.query({}),
    api.streck.getItems.query(),
  ]);

  const downloadLink =
    `data:text/csv;charset=utf-8,Namn,Saldo,${encodeURIComponent(
      items.map((item) => `${item.name} ${item.price}p`).join(',') + '\n',
    )}` +
    encodeURIComponent(
      activeCorps
        .map((corps) => `${displayName(corps)},${corps.balance}`)
        .join('\n'),
    );

  return (
    <div className='flex flex-col gap-4'>
      <h2>Streckkonton</h2>
      <div className='flex flex-col gap-2'>
        <Button href='streck/new'>
          <IconTablePlus />
          Inför ny strecklista...
        </Button>
        <a
          href={downloadLink}
          download={`Strecklista ${dayjs(new Date()).format('YYYY-MM-DD')}.csv`}
        >
          <Button>
            <IconDownload />
            Ladda ner som CSV
          </Button>
        </a>
        <Button href='/admin/streck/prices'>
          <IconCoins />
          Ändra priser...
        </Button>
      </div>
      <div className='flex grow flex-col gap-2'>
        <h3>Senaste händelser</h3>
        <div className='overflow-x-auto'>
          <table className='table text-sm'>
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
                  <td className='px-1 text-right'>{transaction.pricePer}</td>
                  <td className='px-1 text-right'>{transaction.amount}</td>
                  <td className='px-1 text-right'>{transaction.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStreckPage;
