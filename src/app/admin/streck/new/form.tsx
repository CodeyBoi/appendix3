'use client';

import { StreckItem as PrismaStreckItem } from '@prisma/client';
import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import Loading from 'components/loading';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'trpc/react';

interface AdminStreckFormProps {
  items: PrismaStreckItem[];
}

const AdminStreckForm = ({ items }: AdminStreckFormProps) => {
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

  const mutation = api.streck.addTransactions.useMutation({
    onSuccess: () => {
      router.push('/admin/streck');
      utils.streck.getActiveCorps.invalidate();
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
        data.push({
          corpsId: corps.id,
          item: item.name,
          amount: -formValue,
          pricePer: item.price,
        });
      }
      const deposit = values[`${corps.id}:Insättning`]?.trim();
      if (!deposit) {
        continue;
      }
      data.push({
        corpsId: corps.id,
        item: 'Insättning',
        amount: 1,
        pricePer: +deposit,
      });
    }
    mutation.mutate({ transactions: data });
  };

  if (isInitialLoading || isFetching || isRefetching) {
    return <Loading msg='Laddar strecklista...' />;
  }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <table className='table text-sm'>
          <thead>
            <tr className='text-xs'>
              <th className='px-1'>Namn</th>
              <th className='px-1'>Saldo</th>
              {items.map((item) => (
                <th
                  key={item.id}
                  className='px-1'
                >{`${item.name} ${item.price}p`}</th>
              ))}
              <th className='px-1'>Insättning</th>
            </tr>
          </thead>
          <tbody className='gap-1 divide-y divide-solid dark:divide-neutral-800'>
            {activeCorps.map((corps) => (
              <tr
                key={corps.id}
                className='divide-x divide-solid dark:divide-neutral-800'
              >
                <td className='px-1'>
                  <CorpsDisplay corps={corps} />
                </td>
                <td className='px-1 text-center'>{corps.balance}</td>
                {items.map((item) => (
                  <td key={item.id} className='px-1'>
                    <input
                      className='w-16 bg-transparent px-2 py-0.5'
                      type='number'
                      {...register(`${corps.id}:${item.name}`)}
                    />
                  </td>
                ))}
                <td className='px-1'>
                  <input
                    className='w-16 bg-transparent px-2 py-0.5'
                    type='number'
                    {...register(`${corps.id}:Insättning`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='h-2' />
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty || isLoading || isSubmitted}
        >
          {!isSubmitting && !isSubmitted && 'Skicka in'}
          {isSubmitting && 'Skickar...'}
          {isSubmitted && 'Skickad!'}
        </Button>
      </form>
    </div>
  );
};

export default AdminStreckForm;
