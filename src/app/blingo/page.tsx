import React from 'react';
import BingoEntryForm from 'components/blingo/entry-form';
import BingoCard from 'components/blingo/card';
import { api } from 'trpc/server';
import GenerateBingoButton from 'components/blingo/button';
import Restricted from 'components/restricted';

const Bingo = async () => {
  const card = await api.bingo.getCard.query();
  console.log(card);
  return (
    <div className='flex flex-col gap-2'>
      <h2>Blingo™</h2>
      {card && <BingoCard card={card} />}
      <Restricted permissions='addBingoEntry'>
        <BingoEntryForm />
      </Restricted>
      {!card && <GenerateBingoButton />}
    </div>
  );
};

export default Bingo;
