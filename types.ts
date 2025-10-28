
import type { TETROMINOES } from './lib/tetris';

export type TetrominoShape = keyof typeof TETROMINOES;
export type CellValue = 0 | TetrominoShape;
export type GameBoard = CellValue[][];

export interface PlayerPiece {
  pos: { x: number; y: number };
  shape: number[][];
  color: string;
  collided: boolean;
}
