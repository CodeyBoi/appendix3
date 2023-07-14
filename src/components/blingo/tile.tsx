import { createStyles, UnstyledButton } from '@mantine/core';
import React from 'react';

type BingoTileProps = {
  text: string;
  marked?: boolean;
  onChange?: () => void;
};

const useStyles = createStyles((theme) => ({
  // https://stackoverflow.com/a/13625843 - responsive square
  tile: {
    backgroundColor: theme.colors.red[5],
    position: 'relative',
    width: '100%',
    height: 0,
    paddingBottom: '100%',
    borderRadius: theme.radius.sm,
    textAlign: 'center',
    '&:hover': {
      backgroundColor: theme.colors.red[6],
    },
  },
  tileText: {
    color: theme.white,
    fontSize: theme.fontSizes.xs,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
}));

const BingoTile = ({ text, marked = false, onChange }: BingoTileProps) => {
  const { classes } = useStyles();
  const [filledState, setFilledState] = React.useState(marked);
  return (
    <UnstyledButton
      className={classes.tile}
      onClick={() => {
        console.log(!filledState);
        setFilledState(!filledState);
        if (onChange) {
          onChange();
        }
      }}
    >
      <div className={classes.tileText}>{text}</div>
    </UnstyledButton>
  );
};

export default BingoTile;
