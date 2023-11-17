'use client';

import { IconTrash } from '@tabler/icons-react';
import Button from 'components/input/button';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

const KillerControl = ({ id }: { id: string }) => {
  const router = useRouter();
  const mutation = api.killer.remove.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className='flex gap-2'>
      <Button
        onClick={() => {
          if (confirm('Är du säker på att du vill ta bort spel?')) {
            mutation.mutate({ id });
          }
        }}
      >
        <IconTrash />
        Ta bort spel
      </Button>
    </div>
  );
};

export default KillerControl;
