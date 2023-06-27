import { Card, Checkbox } from '@mantine/core';
import React from 'react';

type BingoTileProps = {
  text: string;
};

const BingoTile = ({ text }: BingoTileProps) => {
  return (
    <Card shadow='sm' radius='md' withBorder>
      <Checkbox />
      {text}
    </Card>
  );
};

export default BingoTile;
