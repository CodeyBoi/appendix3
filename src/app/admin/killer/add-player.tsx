'use client';

import { IconPencil } from '@tabler/icons-react';
import Button from 'components/input/button';
import SelectCorps from 'components/select-corps';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type KillerAddPlayerProps = {
  corpsId?: string;
  participants?: {
    corps: {
      id: string;
    };
  }[];
};

const KillerAddPlayer = ({
  corpsId,
  participants = [],
}: KillerAddPlayerProps) => {
  const router = useRouter();
  const mutation = api.killer.addParticipant.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return corpsId ? (
    <Button
      onClick={() => {
        mutation.mutateAsync({
          corpsId,
        });
      }}
    >
      <IconPencil />
      Anmäl mig!
    </Button>
  ) : (
    <SelectCorps
      onChange={(id) => {
        mutation.mutateAsync({
          corpsId: id,
        });
      }}
      filter={(corps) => participants.every((p) => p.corps.id !== corps.value)}
    />
  );
};

export default KillerAddPlayer;
