import { Button, Card, Checkbox } from '@mantine/core';
import React from 'react';

type BingoTileProps = {
  text: string;
  marked?: boolean;
  onChange?: () => void;
};

const BingoTile = ({ text, marked = false, onChange }: BingoTileProps) => {
  const [filledState, setFilledState] = React.useState(marked);
  return (
    <Button onClick={() => {
      console.log(!filledState)
      setFilledState(!filledState);
      if (onChange) {
        onChange();
      }
    }}>

      {text}

    </Button >


  );
};

export default BingoTile;
