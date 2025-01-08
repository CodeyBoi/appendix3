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

export type AdminStreckFormType = 'strecklist' | 'deposit' | 'cost';

type Corps = {
  id: string;
  number: number | null;
  firstName: string;
  lastName: string;
};

type Transaction = {
  corps: Corps;
  item: string;
  pricePer: number;
  amount: number;
  totalPrice: number;
  verificationNumber: string | null;
  note: string;
};

type StreckItem = {
  name: string;
  price: number;
};

interface AdminStreckFormProps {
  id?: number;
  transactions?: Transaction[];
  items: StreckItem[];
  type: AdminStreckFormType;
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
  type,
}: AdminStreckFormProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const isNew = id === undefined;

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isSubmitted, isDirty, isLoading },
  } = useForm();

  const corpsInList = new Set(transactions.map((t) => t.corps.id));

  const [additionalCorps, setAdditionalCorps] = useState<string[]>(
    Array.from(corpsInList),
  );

  const {
    data: activeCorps = [],
    isInitialLoading,
    isFetching,
    isRefetching,
  } = api.streck.getActiveCorps.useQuery({
    additionalCorps,
  });

  const additionalCorpsSet = new Set(additionalCorps);
  const corpsii = isNew
    ? activeCorps
    : activeCorps.filter((c) => additionalCorpsSet.has(c.id));

  const getAmount = (transaction: Transaction) => {
    switch (type) {
      case 'strecklist':
        return transaction.amount;
      case 'deposit':
        return transaction.pricePer;
      case 'cost':
        return -transaction.pricePer;
    }
  };

  const initialAmounts = transactions.reduce((acc, transaction) => {
    const key = `${transaction.corps.id}:${transaction.item}`;
    acc.set(key, (acc.get(key) ?? 0) + getAmount(transaction));
    return acc;
  }, new Map<string, number>());

  const initialBalances = transactions.reduce((acc, transaction) => {
    const key = transaction.corps.id;
    acc.set(key, (acc.get(key) ?? 0) + transaction.totalPrice);
    return acc;
  }, new Map<string, number>());

  const initialNotes = ['deposit', 'cost'].includes(type)
    ? transactions.reduce((acc, { corps, verificationNumber, note }) => {
        acc.set(corps.id, { verificationNumber, note });
        return acc;
      }, new Map<string, { verificationNumber: string | null; note: string }>())
    : undefined;

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
    for (const corps of corpsii) {
      for (const item of items) {
        const formValue = parseInt(
          values[`${corps.id}:${item.name}`]?.trim() ?? '',
        );
        const verificationNumber =
          values[`${corps.id}:verificationNumber`]?.trim() || undefined;
        const note = values[`${corps.id}:note`]?.trim();
        if (isNaN(formValue)) {
          continue;
        }

        // If `price` is NaN, user fills in price and `amount` is set to 1
        const entry = isNaN(item.price)
          ? {
              amount: 1,
              pricePer: type === 'deposit' ? formValue : -formValue,
              verificationNumber,
              note,
            }
          : {
              amount: formValue,
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
          <div className='overflow-x-auto overflow-y-hidden'>
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
                  {type === 'deposit' && (
                    <th className='px-1'>Verifikatsnummer</th>
                  )}
                  {(type === 'deposit' || type === 'cost') && (
                    <th className='px-1'>Anteckning</th>
                  )}
                </tr>
              </thead>
              <tbody className='gap-1 divide-y divide-solid rounded dark:divide-neutral-800'>
                {corpsii.map((corps) => (
                  <tr
                    key={corps.id}
                    className={`divide-x divide-solid dark:divide-neutral-800 ${rowBackgroundColor(
                      corps.balance - (initialBalances.get(corps.id) ?? 0),
                    )}`}
                  >
                    <td className='whitespace-nowrap px-1'>
                      <CorpsDisplay corps={corps} nameFormat='full-name' />
                    </td>
                    <td className='px-1 text-right'>
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
                    {type === 'deposit' && initialNotes && (
                      <td className='px-1'>
                        <input
                          className='w-24 bg-transparent px-2 py-0.5'
                          type='text'
                          defaultValue={
                            initialNotes.get(corps.id)?.verificationNumber ||
                            undefined
                          }
                          {...register(`${corps.id}:verificationNumber`)}
                        />
                      </td>
                    )}
                    {(type === 'deposit' || type === 'cost') &&
                      initialNotes && (
                        <td className='px-1'>
                          <input
                            className='bg-transparent px-2 py-0.5'
                            type='text'
                            defaultValue={initialNotes.get(corps.id)?.note}
                            {...register(`${corps.id}:note`)}
                          />
                        </td>
                      )}
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
