'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type DeleteStreckListButtonProps = {
  id: number;
};

const DeleteStreckListButton = ({ id }: DeleteStreckListButtonProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const mutation = api.streck.removeStreckList.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <ActionIcon
      variant='subtle'
      onClick={() => {
        if (confirm('Är du säker på att du vill ta bort strecklistan?')) {
          mutation.mutate({ id });
          utils.streck.getTransactions.invalidate();
          utils.streck.getStreckList.invalidate({ id });
          utils.streck.getStreckLists.invalidate();
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
};

export default DeleteStreckListButton;
