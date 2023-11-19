import React from 'react';
import BingoEntryForm from 'components/blingo/entry-form';
import BingoCard from 'components/blingo/card';
import { api } from 'trpc/server';
import GenerateBingoButton from 'components/blingo/button';

const Bingo = async () => {
  const card = await api.bingo.getCard.query();
  const permissions = await api.corps.permissions.query();
  console.log(card);
  return (
    <div className='flex flex-col gap-2'>
      <h2>Blingo™</h2>
      {card && <BingoCard card={card} />}
      {permissions.includes('admin') && <BingoEntryForm />}
      {!card && <GenerateBingoButton />}
    </div>
  );
};

export default Bingo;
