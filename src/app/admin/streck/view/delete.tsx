'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

type DeleteTransactionButtonProps = {
  id: number;
};

const DeleteTransactionButton = ({ id }: DeleteTransactionButtonProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const mutation = api.streck.removeTransaction.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  console.log({ id });
  return (
    <ActionIcon
      variant='subtle'
      onClick={() => {
        if (confirm('Är du säker på att du vill ta bort transaktionen?')) {
          mutation.mutate({ id });
          utils.streck.getTransactions.invalidate();
        }
      }}
    >
      <IconTrash />
    </ActionIcon>
  );
};

export default DeleteTransactionButton;
