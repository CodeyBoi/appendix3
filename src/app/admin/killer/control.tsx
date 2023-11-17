'use client';

import { IconSword, IconTrash } from '@tabler/icons-react';
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

  const startGame = api.killer.start.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className='flex gap-2'>
      <Button onClick={() => mutation.mutate({ id })}>
        <IconTrash />
        Ta bort spel
      </Button>
      <Button onClick={() => startGame.mutate()}>
        <IconSword />
        Starta spel
      </Button>
    </div>
  );
};

export default KillerControl;
