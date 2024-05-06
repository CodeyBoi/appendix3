'use client';

import Button from 'components/input/button';
import { api } from 'trpc/react';

const GenerateBingoButton = () => {
  const utils = api.useUtils();
  const mutation = api.bingo.generateCard.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
    },
  });
  return (
    <Button
      onClick={async () => {
        await mutation.mutateAsync();
        location.reload();
        //Kanske onödig reload
      }}
    >
      Skapa blingobricka
    </Button>
  );
};

export default GenerateBingoButton;
