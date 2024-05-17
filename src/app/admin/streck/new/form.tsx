'use client';

import { StreckItem as PrismaStreckItem } from '@prisma/client';
import CorpsDisplay from 'components/corps/display';
import Button from 'components/input/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api } from 'trpc/react';

interface AdminStreckFormProps {
  items: PrismaStreckItem[];
  activeCorps: {
    id: string;
    number: number | null;
    firstName: string;
    lastName: string;
    nickName: string | null;
    balance: number;
  }[];
}

const AdminStreckForm = ({ items, activeCorps }: AdminStreckFormProps) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isLoading },
  } = useForm();

  const mutation = api.streck.addTransactions.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push('/admin/streck');
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
          amount: Number(formValue),
          pricePer: -item.price,
        });
      }
    }
    mutation.mutate({ transactions: data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <table className='table text-sm'>
        <thead>
          <tr className='text-xs'>
            <th className='px-1 text-right'>Namn</th>
            <th className='px-1'>Saldo</th>
            {items.map((item) => (
              <th
                key={item.id}
                className='px-1'
              >{`${item.name} ${item.price}p`}</th>
            ))}
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
            </tr>
          ))}
        </tbody>
      </table>
      <Button type='submit' disabled={isSubmitting || !isDirty || isLoading}>
        Skicka in
      </Button>
    </form>
  );
};

export default AdminStreckForm;
