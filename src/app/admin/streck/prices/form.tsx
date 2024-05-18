'use client';

import { StreckItem as PrismaStreckItem } from '@prisma/client';
import Button from 'components/input/button';
import TextArea from 'components/input/text-area';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from 'trpc/react';

type AdminStreckPricesFormProps = {
  initialItems: PrismaStreckItem[];
};

const AdminStreckPricesForm = ({
  initialItems,
}: AdminStreckPricesFormProps) => {
  const utils = api.useUtils();
  const router = useRouter();

  const initialItemText = initialItems
    .map((item) => item.name + ', ' + item.price)
    .join('\n');

  const [itemText, setItemText] = useState(initialItemText);

  const mutation = api.streck.setPrices.useMutation({
    onSuccess: () => {
      utils.streck.getItems.invalidate();
      router.back();
    },
  });

  return (
    <div className='flex max-w-md flex-col gap-4'>
      <h3>Ändra streckpriser</h3>
      <TextArea value={itemText} onChange={setItemText} />
      <Button
        onClick={() => {
          const items = itemText
            .split('\n')
            .filter((e) => e.trim() !== '')
            .map((line) => {
              const data = line.split(',');
              return {
                name: data[0]?.trim() as string,
                price: +(data[1] || 0),
              };
            });
          mutation.mutate({ items });
        }}
      >
        Spara
      </Button>
    </div>
  );
};

export default AdminStreckPricesForm;
