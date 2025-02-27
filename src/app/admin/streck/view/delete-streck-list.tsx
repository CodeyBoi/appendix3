'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

interface DeleteStreckListButtonProps {
  id: number;
  properRemove?: boolean;
}

const DeleteStreckListButton = ({
  id,
  properRemove = false,
}: DeleteStreckListButtonProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const options = {
    onSuccess: async () => {
      await utils.streck.getTransactions.invalidate();
      await utils.streck.get.invalidate({ id });
      await utils.streck.getStreckLists.invalidate();
      router.refresh();
    },
  };
  const mutation = (
    properRemove ? api.streck.removeStreckList : api.streck.deleteStreckList
  ).useMutation(options);
  return (
    <ActionIcon
      variant='subtle'
      onClick={() => {
        if (
          confirm(
            'Är du säker på att du vill ta bort strecklistan?' +
              (properRemove
                ? ' Detta är permanent och går inte att ångra!'
                : ''),
          )
        ) {
          mutation.mutate({ id });
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
};

export default DeleteStreckListButton;
