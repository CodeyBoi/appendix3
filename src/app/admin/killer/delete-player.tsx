'use client';

import { IconTrash } from '@tabler/icons-react';
import Button from 'components/input/button';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type DeletePlayerProps = {
  killerId: number;
};

const KillerDeletePlayer = ({ killerId }: DeletePlayerProps) => {
  const router = useRouter();
  const mutation = api.killer.removeParticipant.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Button
      onClick={async () => {
        await mutation.mutateAsync({
          killerId,
        });
      }}
    >
      <IconTrash />
      Avanmäl mig!
    </Button>
  );
};

export default KillerDeletePlayer;
