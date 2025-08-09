import React, { ReactNode } from 'react';
import { cn } from 'utils/class-names';

interface BoardProps {
  board: ReactNode[][];
}

const Board = ({ board }: BoardProps) => {
  return (
    <div>
      <table className='table'>
        <tbody className='divide-y divide-solid dark:divide-neutral-700'>
          {board.map((row) => (
            <tr className='divide-x divide-solid dark:divide-neutral-700'>
              {row.map((tile) => (
                <td className={cn('h-8 w-8', tile && 'bg-red-600')}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Board;
