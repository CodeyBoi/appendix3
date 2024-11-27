'use client';

import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import Loading from 'components/loading';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'trpc/react';

const rowBackgroundColor = (balance: number) => {
  if (balance < 0) {
    return 'bg-red-100 dark:bg-red-900';
  } else if (balance < 200) {
    return 'bg-gray-100 dark:bg-gray-800';
  } else {
    return '';
  }
};

const AdminTransactionForm = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const {
    handleSubmit,
    register,
    formState: {
      isSubmitting,
      isSubmitted,
      isDirty,
      isLoading,
      errors,
      isValid,
    },
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

  const mutation = api.streck.upsertStreckList.useMutation({
    onSuccess: () => {
      router.push('/admin/streck');
      utils.streck.getActiveCorps.invalidate();
      utils.streck.getTransactions.invalidate();
      router.refresh();
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    const data = [];
    const item = values.item;
    if (!item) {
      return;
    }
    for (const corps of activeCorps) {
      const pricePer = values[corps.id]?.trim();
      if (!pricePer) {
        continue;
      }
      data.push({
        corpsId: corps.id,
        item,
        amount: 1,
        pricePer: +pricePer,
      });
    }
    mutation.mutate({ transactions: data });
  };

  const isReady = !isInitialLoading && !isFetching && !isRefetching;

  return (
    <div className='flex max-w-lg flex-col gap-4'>
      <h2>Lägg till kostnad eller insättning</h2>
      Belopp avser förändring för medlemmen, d.v.s. betyder ett positivt belopp
      en intäkt för medlemmen (t.ex. insättning på streckkonto eller återbäring
      för utlägg) och ett negativt belopp en kostnad för medlemmen (t.ex.
      corpsafton eller Pryl&Prov-saker).
      {!isReady && <Loading msg='Hämtar corpslista...' />}
      {isReady && (
        <>
          <div className='max-w-md'>
            <SelectCorps
              label='Lägg till corps...'
              excludeIds={activeCorps.map((corps) => corps.id)}
              onChange={(id) => {
                setAdditionalCorps((old) => [...old, id]);
              }}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <table className='table text-sm'>
              <thead>
                <tr className='text-xs'>
                  <th className='px-1'>Namn</th>
                  <th className='px-1'>Saldo</th>
                  <th className='px-1'>Belopp</th>
                </tr>
              </thead>
              <tbody className='gap-1 divide-y divide-solid rounded dark:divide-neutral-800'>
                {activeCorps.map((corps) => (
                  <tr
                    key={corps.id}
                    className={`divide-x divide-solid dark:divide-neutral-800 ${rowBackgroundColor(
                      corps.balance,
                    )}`}
                  >
                    <td className='px-1'>
                      <CorpsDisplay corps={corps} nameFormat='full-name' />
                    </td>
                    <td className='px-1 text-center'>{corps.balance}</td>
                    <td className='px-1'>
                      <input
                        className='w-16 bg-transparent px-2 py-0.5'
                        type='number'
                        {...register(corps.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='h-4' />
            <input
              className='rounded border p-2 shadow-md'
              placeholder='Transaktionsbeskrivning'
              required
              {...register('item', { required: true })}
            />
            {errors.item?.type === 'required' && (
              <p role='alert'>Fyll i transaktionsbeskrivning</p>
            )}
            <div className='h-4' />
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={
                isSubmitting || !isDirty || isLoading || isSubmitted || !isValid
              }
            >
              {!isSubmitting && !isSubmitted && 'Skicka in'}
              {isSubmitting && 'Skickar...'}
              {isSubmitted && 'Skickad!'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminTransactionForm;
