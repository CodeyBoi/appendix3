import { Button, SimpleGrid } from '@mantine/core';
import React from 'react';
import BingoTile from '../../components/blingo/tile';
import { trpc } from '../../utils/trpc';
import BingoEntryForm from '../../components/blingo/entry-form';

const Bingo = () => {
  const utils = trpc.useContext();

  const [loading, setLoading] = React.useState(false);

  const { data: card } = trpc.bingo.getCard.useQuery();

  const onSuccess = () => {
    utils.bingo.getCard.invalidate();
    setLoading(false);
  };
  const generateCard = trpc.bingo.generateCard.useMutation({ onSuccess });
  const markEntry = trpc.bingo.markEntry.useMutation({ onSuccess });

  const entries = card?.entries
    .sort((a, b) => a.index - b.index)
    .map((entry) => ({
      ...entry.entry,
      marked: entry.marked,
    }));

  return (
    <div>
      {card && entries && (
        <SimpleGrid cols={5}>
          {entries.map((entry) => (
            <BingoTile
              key={entry.id}
              text={entry.text}
              marked={entry.marked}
              onChange={async () => {
                setLoading(true);
                await markEntry.mutateAsync({
                  cardId: card.id,
                  entryId: entry.id,
                  marked: !entry.marked,
                });
              }}
            />
          ))}
        </SimpleGrid>
      )}

      <BingoEntryForm />
      {!card && (
        <Button
          onClick={async () => {
            setLoading(true);
            await generateCard.mutateAsync();
          }}
        >
          Skapa bricka
        </Button>
      )}
    </div>
  );
};

export default Bingo;
