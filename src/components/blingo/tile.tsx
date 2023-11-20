'use client';

import React from 'react';
import { cn } from 'utils/class-names';

type BingoTileProps = {
  text: string;
  marked?: boolean;
  onChange?: () => void;
};

// const useStyles = createStyles((theme) => ({
//   // https://stackoverflow.com/a/13625843 - responsive square
//   tile: {
//     backgroundColor: theme.colors.red[5],
//     position: 'relative',
//     width: '100%',
//     height: 0,
//     paddingBottom: '100%',
//     borderRadius: theme.radius.sm,
//     textAlign: 'center',
//     '&:hover': {
//       backgroundColor: theme.colors.red[6],
//     },
//   },

//   tileMarked: {
//     backgroundColor: theme.colors.blue[5], // Change this to the desired color
//     position: 'relative',
//     width: '100%',
//     height: 0,
//     paddingBottom: '100%',
//     borderRadius: theme.radius.sm,
//     textAlign: 'center',
//     '&:hover': {
//       backgroundColor: theme.colors.blue[6],
//     },
//   },

//   tileText: {
//     color: theme.white,
//     fontSize: theme.fontSizes.xs,
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%,-50%)',
//   },
// }));

const BingoTile = ({ text, marked = false, onChange }: BingoTileProps) => {
  const [filledState, setFilledState] = React.useState(marked);
  return (
    <button
      className={cn(
        'bg-red-600',
        'w-full',
        'aspect-square',
        'rounded-sm',
        'hover:bg-red-700',
        'transition-colors',
        'border border-red-600',
        filledState ? 'bg-red-600 text-white' : 'bg-white text-red-600',
        filledState
          ? 'hover:bg-white hover:text-red-600'
          : 'hover:bg-red-600 hover:text-white',
      )}
      onClick={() => {
        console.log(!filledState);
        setFilledState(!filledState);
        onChange?.();
      }}
    >
      <div className='text-center text-xs'>{text}</div>
    </button>
  );
};

export default BingoTile;
