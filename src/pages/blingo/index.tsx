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

  const markedEntries = new Set(card?.marked.map((entry) => entry.entryId));

  return (
    <div>
      <SimpleGrid cols={5}>
        {card?.entries.map((entry) => (
          <BingoTile
            key={entry.id}
            text={entry.text}
            marked={markedEntries.has(entry.id)}
            onChange={async () => {
              setLoading(true);
              await markEntry.mutateAsync({
                cardId: card.id,
                entryId: entry.id,
                marked: !markedEntries.has(entry.id),
              });
            }}
          />
        ))}
      </SimpleGrid>

      <BingoEntryForm />
      {!card && (
        <Button
          onChange={async () => {
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
