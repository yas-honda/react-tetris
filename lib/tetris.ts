
import type { GameBoard, PlayerPiece, TetrominoShape } from '../types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES = {
  'I': { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  'J': { shape: [[0, 1, 0], [0, 1, 0], [1, 1, 0]], color: 'bg-blue-500' },
  'L': { shape: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], color: 'bg-orange-500' },
  'O': { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  'S': { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], color: 'bg-green-500' },
  'T': { shape: [[1, 1, 1], [0, 1, 0], [0, 0, 0]], color: 'bg-purple-500' },
  'Z': { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], color: 'bg-red-500' },
};

export const createEmptyBoard = (): GameBoard => 
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const getRandomTetromino = (): TetrominoShape => {
  // FIX: Correctly define the array of tetromino shapes to resolve the TypeScript error.
  const tetrominoes: TetrominoShape[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const randTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  return randTetromino;
};

export const checkCollision = (
  player: PlayerPiece, 
  board: GameBoard, 
  { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
  for (let y = 0; y < player.shape.length; y++) {
    for (let x = 0; x < player.shape[y].length; x++) {
      if (player.shape[y][x] !== 0) {
        const newY = y + player.pos.y + moveY;
        const newX = x + player.pos.x + moveX;

        if (
          !board[newY] ||           // Out of bounds (bottom)
          // FIX: Corrected the logic to check for out of bounds on the sides.
          board[newY][newX] === undefined || // Out of bounds (sides)
          board[newY][newX] !== 0   // Collides with another piece
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
