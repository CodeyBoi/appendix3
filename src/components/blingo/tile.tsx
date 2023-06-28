import { Card, Checkbox } from '@mantine/core';
import React from 'react';

type BingoTileProps = {
  text: string;
  marked?: boolean;
  onChange?: () => void;
};

const BingoTile = ({ text, marked = false, onChange }: BingoTileProps) => {
  const [filledState, setFilledState] = React.useState(marked);
  return (
    <Card shadow='sm' radius='md' withBorder>
      <Checkbox
        checked={filledState}
        onChange={() => {
          setFilledState(!filledState);
          if (onChange) {
            onChange();
          }
        }}
      />
      {text}
    </Card>
  );
};

export default BingoTile;
