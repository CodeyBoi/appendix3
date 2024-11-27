'use client';

import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import Loading from 'components/loading';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'trpc/react';

type Corps = {
  id: string;
  number: number | null;
  firstName: string;
  lastName: string;
};

type Transaction = {
  corps: Corps;
  time: Date;
  item: string;
  pricePer: number;
  amount: number;
  totalPrice: number;
};

type StreckItem = {
  name: string;
  price: number;
};

interface AdminStreckFormProps {
  id?: number;
  transactions?: Transaction[];
  items: StreckItem[];
}

const rowBackgroundColor = (balance: number) => {
  if (balance < 0) {
    return 'bg-red-100 dark:bg-red-900';
  } else if (balance < 200) {
    return 'bg-gray-100 dark:bg-gray-800';
  } else {
    return '';
  }
};

const AdminStreckForm = ({
  id,
  transactions = [],
  items,
}: AdminStreckFormProps) => {
  const router = useRouter();
  const utils = api.useUtils();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isSubmitted, isDirty, isLoading },
  } = useForm();

  const [additionalCorps, setAdditionalCorps] = useState<string[]>([]);

  const {
    data: activeCorps = [],
    isInitialLoading,
    isFetching,
    isRefetching,
  } = api.streck.getActiveCorps.useQuery({
    additionalCorps,
  });

  const itemsSet = new Set(items.map((i) => `${i.name}:${i.price}`));
  for (const transaction of transactions) {
    const key = `${transaction.item}:${-transaction.pricePer}`;
    if (itemsSet.has(key)) {
      continue;
    }
    itemsSet.add(key);
    items.push({ name: transaction.item, price: -transaction.pricePer });
  }

  const initialAmounts = transactions.reduce(
    (acc, transaction) => {
      const key = `${transaction.corps.id}:${
        transaction.item
      }:${-transaction.pricePer}`;
      acc[key] = (acc[key] ?? 0) + transaction.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const initialBalances = transactions.reduce(
    (acc, transaction) => {
      const key = transaction.corps.id;
      acc[key] = (acc[key] ?? 0) + transaction.totalPrice;
      return acc;
    },
    {} as Record<string, number>,
  );

  const mutation = api.streck.upsertStreckList.useMutation({
    onSuccess: () => {
      utils.streck.getActiveCorps.invalidate();
      utils.streck.getTransactions.invalidate();
      utils.streck.getStreckList.invalidate();
      router.refresh();
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    const data = [];
    for (const corps of activeCorps) {
      for (const item of items) {
        const formValue =
          values[`${corps.id}:${item.name}:${item.price}`]?.trim();
        if (!formValue) {
          continue;
        }
        data.push({
          corpsId: corps.id,
          item: item.name,
          amount: +formValue,
          pricePer: -item.price,
        });
      }
    }
    mutation.mutate({ id, transactions: data });
    router.back();
  };

  const isReady = !isInitialLoading && !isFetching && !isRefetching;

  return (
    <div className='flex flex-col gap-4'>
      <h2>Lägg till strecklista</h2>
      <div className='max-w-md'>
        <SelectCorps
          label='Lägg till corps...'
          onChange={(id) => {
            setAdditionalCorps((old) => [...old, id]);
          }}
        />
      </div>
      {!isReady && <Loading msg='Laddar strecklista...' />}
      {isReady && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='overflow-x-auto'>
            <table className='table text-sm'>
              <thead>
                <tr className='text-left align-bottom text-xs'>
                  <th className='px-1'>Namn</th>
                  <th className='px-1'>Saldo</th>
                  {items.map((item) => (
                    <th
                      key={`${item.name}:${item.price}`}
                      className='w-16 px-1'
                    >{`${item.name} ${item.price}p`}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='gap-1 divide-y divide-solid rounded dark:divide-neutral-800'>
                {activeCorps.map((corps) => (
                  <tr
                    key={corps.id}
                    className={`divide-x divide-solid dark:divide-neutral-800 ${rowBackgroundColor(
                      corps.balance - (initialBalances[corps.id] ?? 0),
                    )}`}
                  >
                    <td className='px-1'>
                      <CorpsDisplay corps={corps} nameFormat='full-name' />
                    </td>
                    <td className='px-1 text-center'>
                      {corps.balance - (initialBalances[corps.id] ?? 0)}
                    </td>
                    {items.map((item) => {
                      const key = `${corps.id}:${item.name}:${item.price}`;
                      return (
                        <td key={key} className='px-1'>
                          <input
                            className='w-16 bg-transparent px-2 py-0.5'
                            type='number'
                            defaultValue={initialAmounts[key]}
                            {...register(key)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='h-2' />
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isDirty || isLoading}
          >
            {!isSubmitting && !isSubmitted && 'Skicka in'}
            {isSubmitting && 'Skickar...'}
            {isSubmitted && 'Skickad!'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminStreckForm;
