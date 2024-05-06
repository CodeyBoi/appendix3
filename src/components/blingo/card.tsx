'use client';

import React from 'react';
import BingoTile from './tile';
import { ClientBingoCard } from 'types';
import { api } from 'trpc/react';

type BingoCardProps = {
  card: ClientBingoCard;
};

const BingoCard = ({ card }: BingoCardProps) => {
  const utils = api.useUtils();

  const markEntry = api.bingo.markEntry.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
    },
  });

  const isWin = api.bingo.isWin.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
    },
  });

  const entries = card.entries
    .sort((a, b) => a.index - b.index)
    .map((entry) => ({
      ...entry.entry,
      marked: entry.marked,
    }));

  return (
    <div className='grid max-w-2xl border-separate grid-cols-5'>
      {entries.map((entry) => (
        <BingoTile
          key={entry.id}
          text={entry.text}
          marked={entry.marked}
          onChange={async () => {
            const newMarkedState = !entry.marked;
            entry.marked = newMarkedState;
          
            await markEntry.mutateAsync({
              cardId: card.id,
              entryId: entry.id,
              marked: newMarkedState,
            });
             isWin.mutateAsync({ //EN await här verkar hjälpa
              cardId: card.id,
              entryId: entry.id,
              marked: entry.marked,
            });
           
          }}
        />
      ))}
    </div>
  );
};

export default BingoCard;
