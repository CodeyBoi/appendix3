'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

interface DeletePlayerProps {
  killerId: number;
}

const KillerDeletePlayer = ({ killerId }: DeletePlayerProps) => {
  const router = useRouter();
  const mutation = api.killer.removeParticipant.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <ActionIcon
      variant='subtle'
      onClick={async () => {
        if (confirm('Är du säker på att du vill ta bort spelaren?')) {
          await mutation.mutateAsync({
            killerId,
          });
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
};

export default KillerDeletePlayer;
