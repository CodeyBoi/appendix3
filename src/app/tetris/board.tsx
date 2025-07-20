import React from 'react';
import Piece, { PieceProps } from './piece';
import { Point } from './tetris';

interface BoardProps {
  piece: PieceProps & { position: Point };
  board: boolean[][];
}

const Board = ({ piece, board }: BoardProps) => {
  return <div>{<Piece {...piece} />}</div>;
};

export default Board;
