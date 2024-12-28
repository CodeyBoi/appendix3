'use client';

import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import Loading from 'components/loading';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

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
  items: propItems,
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

  // If transactions has exactly one type of item, this is a one-time
  // payment/deposit (aka. monolist). We handle monolists by only
  // having one item, letting the user fill in price for each corps
  // and fixing `amount` at 1.
  const isMonoList =
    new Set(transactions.map((transaction) => transaction.item)).size === 1;
  const items: StreckItem[] = [];
  if (isMonoList) {
    const firstTransaction = transactions[0];
    if (!firstTransaction) {
      throw new Error(
        'This should be unreachable as `isMonoList === true` implies `transactions` has a length of at least 1',
      );
    }
    items.push({
      name: firstTransaction.item,
      price: NaN,
    });
  } else {
    items.push(...propItems);
    const itemsSet = new Set(items.map((i) => i.name));
    for (const transaction of transactions) {
      const key = transaction.item;
      if (itemsSet.has(key)) {
        continue;
      }
      itemsSet.add(key);
      items.push({ name: transaction.item, price: -transaction.pricePer });
    }
  }

  const initialAmounts = transactions.reduce((acc, transaction) => {
    const key = `${transaction.corps.id}:${transaction.item}`;
    acc.set(
      key,
      (acc.get(key) ?? 0) +
        (isMonoList ? transaction.pricePer : transaction.amount),
    );
    return acc;
  }, new Map<string, number>());

  const initialBalances = transactions.reduce((acc, transaction) => {
    const key = transaction.corps.id;
    acc.set(key, (acc.get(key) ?? 0) + transaction.totalPrice);
    return acc;
  }, new Map<string, number>());

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
        const formValue = values[`${corps.id}:${item.name}`]?.trim();
        if (!formValue) {
          continue;
        }

        // If `price` is NaN, user fills in price and `amount` is set to 1
        const entry = isNaN(item.price)
          ? {
              amount: 1,
              pricePer: +formValue,
            }
          : {
              amount: +formValue,
              pricePer: -item.price,
            };
        data.push({
          corpsId: corps.id,
          item: item.name,
          ...entry,
        });
      }
    }
    mutation.mutate({ id, transactions: data });
    router.back();
  };

  const isReady = !isInitialLoading && !isFetching && !isRefetching;

  return (
    <div className='flex flex-col gap-4'>
      <h2>Inför strecklista</h2>
      <div className='max-w-md'>
        <SelectCorps
          label='Lägg till corps...'
          onChange={(id) => {
            setAdditionalCorps((old) => [...old, id]);
          }}
        />
      </div>
      {!isReady && (
        <Loading
          msg={lang('Hämtar strecklista...', 'Fetching strecklist...')}
        />
      )}
      {isReady && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='overflow-x-auto'>
            <table className='table text-sm'>
              <thead>
                <tr className='divide-x border-b text-left align-bottom text-xs'>
                  <th className='px-1'>Namn</th>
                  <th className='px-1'>Saldo</th>
                  {items.map((item) => (
                    <th key={`${item.name}`} className='w-16 px-1'>{`${
                      item.name
                    } ${isNaN(item.price) ? '' : `${item.price}p`}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='gap-1 divide-y divide-solid rounded dark:divide-neutral-800'>
                {activeCorps.map((corps) => (
                  <tr
                    key={corps.id}
                    className={`divide-x divide-solid dark:divide-neutral-800 ${rowBackgroundColor(
                      corps.balance - (initialBalances.get(corps.id) ?? 0),
                    )}`}
                  >
                    <td className='px-1'>
                      <CorpsDisplay corps={corps} nameFormat='full-name' />
                    </td>
                    <td className='px-1 text-center'>
                      {corps.balance - (initialBalances.get(corps.id) ?? 0)}
                    </td>
                    {items.map((item) => {
                      const key = `${corps.id}:${item.name}`;
                      return (
                        <td key={key} className='px-1'>
                          <input
                            className='w-16 bg-transparent px-2 py-0.5'
                            type='number'
                            defaultValue={initialAmounts.get(key)}
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
            {!isSubmitting && !isSubmitted && lang('Spara', 'Submit')}
            {isSubmitting && lang('Sparar...', 'Submitting...')}
            {isSubmitted && lang('Sparad!', 'Submitted!')}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdminStreckForm;
