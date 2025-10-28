
import React from 'react';
import type { GameBoard as GameBoardType, PlayerPiece } from '../types';
import { TETROMINOES } from '../lib/tetris';

interface GameBoardProps {
  board: GameBoardType;
  player: PlayerPiece | null;
}

const Cell: React.FC<{ type: keyof typeof TETROMINOES | 0 }> = React.memo(({ type }) => {
  const color = type === 0 ? 'bg-slate-900' : TETROMINOES[type].color;
  const border = type === 0 ? 'border-slate-800' : 'border-slate-600';
  return <div className={`w-full aspect-square ${color} border-[1px] ${border}`}></div>;
});

export const GameBoard: React.FC<GameBoardProps> = ({ board, player }) => {
  const boardToRender = React.useMemo(() => {
    const newBoard = board.map(row => [...row]);
    if (player) {
      player.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + player.pos.y;
            const boardX = x + player.pos.x;
            if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < newBoard[0].length) {
                // Find the key for the current shape
                const shapeKey = Object.keys(TETROMINOES).find(key => 
                    TETROMINOES[key as keyof typeof TETROMINOES].color === player.color
                ) as keyof typeof TETROMINOES;
                newBoard[boardY][boardX] = shapeKey || 'I';
            }
          }
        });
      });
    }
    return newBoard;
  }, [board, player]);

  return (
    <div className="grid grid-cols-10 grid-rows-20 w-[250px] md:w-[300px] lg:w-[350px]">
      {boardToRender.map((row, y) => 
        row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell} />)
      )}
    </div>
  );
};
