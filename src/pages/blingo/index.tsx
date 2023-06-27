import { Button, Checkbox, Grid, SimpleGrid } from '@mantine/core';
import React from 'react';
import BingoTile from '../../components/blingo/tile';
import { trpc } from '../../utils/trpc';
import BingoEntryForm from '../../components/blingo/entry-form';

const Bingo = () => {
  const utils = trpc.useContext();

  const { data: card } = trpc.bingo.getCard.useQuery();
  const mutation = trpc.bingo.generateCard.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
    },
  });

  return (
    <div>
      <SimpleGrid cols={5}>
        {card?.entries.map((entry) => (
          <BingoTile key={entry.id} text={entry.text}></BingoTile>
        ))}
      </SimpleGrid>

      <BingoEntryForm></BingoEntryForm>
      {!card && (
        <Button onClick={async () => await mutation.mutateAsync()}>
          Skapa bricka
        </Button>
      )}
    </div>
  );
};

export default Bingo;
