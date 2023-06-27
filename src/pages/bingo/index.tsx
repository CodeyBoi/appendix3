
import { Checkbox, Grid, SimpleGrid } from '@mantine/core';
import React from 'react';
import BingoTile from '../../components/bingo/tile';
import { trpc } from '../../utils/trpc';
import BingoEntryForm from '../../components/bingo/entry-form';

const Bingo = () => {

  const { data: card } = trpc.bingo.getCard.useQuery();



  return (
    <div>
      <SimpleGrid cols={5}>
        {card?.entries.map((entry) => (
          <BingoTile text={entry.text}></BingoTile>
        ))}


      </SimpleGrid>


      <BingoEntryForm></BingoEntryForm>
    </div>


  );

}

export default Bingo;
