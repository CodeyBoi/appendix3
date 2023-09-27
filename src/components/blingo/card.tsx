import { SimpleGrid } from '@mantine/core';
import React from 'react';
import BingoTile from './tile';
import { ClientBingoCard } from '../../types';
import { trpc } from '../../utils/trpc';

type BingoCardProps = {
  card: ClientBingoCard;
};

const BingoCard = ({ card }: BingoCardProps) => {
  const utils = trpc.useContext();
  const [loading, setLoading] = React.useState(false);

  const markEntry = trpc.bingo.markEntry.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
      setLoading(false);
    },
  });

  const isWin = trpc.bingo.isWin.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
      setLoading(false);
    },
  });

  const entries = card.entries
    .sort((a, b) => a.index - b.index)
    .map((entry) => ({
      ...entry.entry,
      marked: entry.marked,
    }));

  return (
    <SimpleGrid cols={5} spacing='xs'>
      {entries.map((entry) => (
        <BingoTile
          key={entry.id}
          text={entry.text}
          marked={entry.marked}
          onChange={async () => {
            const newMarkedState = !entry.marked;
            entry.marked = newMarkedState;

            setLoading(true);

            await isWin.mutateAsync({
              cardId: card.id,
              entryId: entry.id,
              marked: newMarkedState,
            });
            await markEntry.mutateAsync({
              cardId: card.id,
              entryId: entry.id,
              marked: newMarkedState,
            });



          }}
        />
      ))}
    </SimpleGrid>
  );
};

export default BingoCard;
