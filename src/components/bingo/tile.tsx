
import { Card, Checkbox, Grid } from '@mantine/core';
import React from 'react';

interface BingoTileProps {

  text: string;


}



const BingoTile = ({ text }: BingoTileProps) => {





  return (
    <Card shadow="sm" radius="md" withBorder>
      <Checkbox />
      {text}


    </Card>


  );

}

export default BingoTile;
