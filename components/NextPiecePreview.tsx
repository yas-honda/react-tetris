
import React from 'react';
import type { TetrominoShape } from '../types';
import { TETROMINOES } from '../lib/tetris';

interface NextPiecePreviewProps {
  shapeKey: TetrominoShape;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ shapeKey }) => {
  const { shape, color } = TETROMINOES[shapeKey];
  const grid_size = 4;

  const displayGrid = Array.from({ length: grid_size }, () => Array(grid_size).fill(0));

  const offsetX = Math.floor((grid_size - shape[0].length) / 2);
  const offsetY = Math.floor((grid_size - shape.length) / 2);

  shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        displayGrid[y + offsetY][x + offsetX] = 1;
      }
    });
  });

  return (
    <div className="p-4 bg-slate-800 rounded-lg border-2 border-slate-700">
      <h3 className="text-lg font-bold mb-2 text-center text-cyan-400">NEXT</h3>
      <div className="grid grid-cols-4 grid-rows-4 gap-1 w-24 h-24 mx-auto">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-full h-full ${cell ? color : 'bg-slate-900'}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};
