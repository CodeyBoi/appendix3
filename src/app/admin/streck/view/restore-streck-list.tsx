'use client';

import { IconRestore } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type RestoreStreckListButtonProps = {
  id: number;
};

const RestoreStreckListButton = ({ id }: RestoreStreckListButtonProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const options = {
    onSuccess: () => {
      utils.streck.getTransactions.invalidate();
      utils.streck.getStreckList.invalidate({ id });
      utils.streck.getStreckLists.invalidate();
      router.refresh();
    },
  };
  const mutation = api.streck.restoreStreckList.useMutation(options);
  return (
    <ActionIcon
      variant='subtle'
      onClick={() => {
        if (confirm('Är du säker på att du vill återställa strecklistan?')) {
          mutation.mutate({ id });
        }
      }}
    >
      <IconRestore />
    </ActionIcon>
  );
};

export default RestoreStreckListButton;
