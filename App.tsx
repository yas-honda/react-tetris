import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Scoreboard } from './components/Scoreboard';
import { NextPiecePreview } from './components/NextPiecePreview';
import { GameOverModal } from './components/GameOverModal';
import { Leaderboard } from './components/Leaderboard';
import { useGameLoop } from './hooks/useGameLoop';
import { 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  createEmptyBoard, 
  getRandomTetromino,
  checkCollision,
  TETROMINOES
} from './lib/tetris';
import type { GameBoard as GameBoardType, PlayerPiece, TetrominoShape } from './types';

const App: React.FC = () => {
  const [board, setBoard] = useState<GameBoardType>(createEmptyBoard());
  const [player, setPlayer] = useState<PlayerPiece | null>(null);
  const [nextPieceShape, setNextPieceShape] = useState<TetrominoShape | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const resetPlayer = useCallback(() => {
    const newShape = nextPieceShape || getRandomTetromino();
    const newTetromino = TETROMINOES[newShape];
    const newPlayer: PlayerPiece = {
      pos: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newTetromino.shape[0].length / 2), y: 0 },
      shape: newTetromino.shape,
      color: newTetromino.color,
      collided: false,
    };

    if (checkCollision(newPlayer, board, { x: 0, y: 0 })) {
      setIsGameOver(true);
      setDropTime(null);
      setIsPaused(true);
      return;
    }

    setPlayer(newPlayer);
    setNextPieceShape(getRandomTetromino());
  }, [board, nextPieceShape]);
  
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(0);
    setDropTime(1000);
    setNextPieceShape(getRandomTetromino());
    setPlayer(null);
    setIsGameOver(false);
    setIsPaused(false);
    setLeaderboardKey(prev => prev + 1); // Refresh leaderboard
  }, []);

  useEffect(() => {
    if (!player && !isGameOver && !isPaused) {
      resetPlayer();
    }
  }, [player, isGameOver, isPaused, resetPlayer]);
  
  const handleScoreSubmitted = () => {
    setLeaderboardKey(prev => prev + 1);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided?: boolean }) => {
    if (!player) return;
    setPlayer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        pos: { x: prev.pos.x + x, y: prev.pos.y + y },
        collided: collided !== undefined ? collided : prev.collided,
      };
    });
  };

  const rotateMatrix = (matrix: number[][]): number[][] => {
    const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
    return rotated.map(row => row.reverse());
  };

  const rotatePlayer = () => {
    if (!player || isPaused) return;

    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.shape = rotateMatrix(clonedPlayer.shape);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.shape[0].length) {
        return; // Rotation failed
      }
    }

    setPlayer(clonedPlayer);
  };

  const drop = useCallback(() => {
    if (!player || isPaused || isGameOver) return;

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1 });
    } else {
      if (player.pos.y < 1) {
        setIsGameOver(true);
        setDropTime(null);
        setIsPaused(true);
        return;
      }
      setPlayer(prev => prev ? { ...prev, collided: true } : null);
    }
  }, [player, board, isPaused, isGameOver]);

  const hardDrop = () => {
    if (!player || isPaused) return;
    let newY = player.pos.y;
    while (!checkCollision(player, board, { x: 0, y: newY - player.pos.y + 1 })) {
        newY++;
    }
    setPlayer(prev => prev ? { ...prev, pos: { ...prev.pos, y: newY }, collided: true } : null);
  };


  useEffect(() => {
    if (player?.collided) {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => row.slice());
        
        const shapeKey = (Object.keys(TETROMINOES) as Array<keyof typeof TETROMINOES>).find(
          (key) => TETROMINOES[key].color === player.color
        );

        if (shapeKey) {
          player.shape.forEach((row, y) => {
            row.forEach((value, x) => {
              if (value !== 0) {
                newBoard[y + player.pos.y][x + player.pos.x] = shapeKey;
              }
            });
          });
        }

        let linesCleared = 0;
        const sweptBoard = newBoard.reduce((acc, row) => {
          if (row.every(cell => cell !== 0)) {
            linesCleared++;
            acc.unshift(new Array(BOARD_WIDTH).fill(0));
          } else {
            acc.push(row);
          }
          return acc;
        }, [] as GameBoardType);
        
        if (linesCleared > 0) {
            const linePoints = [0, 40, 100, 300, 1200];
            setScore(prev => prev + linePoints[linesCleared] * (level + 1));
            setLines(prev => prev + linesCleared);
        }

        return sweptBoard;
      });
      resetPlayer();
    }
  }, [player, resetPlayer, level]);
  
  useEffect(() => {
      if (lines > (level + 1) * 10) {
          setLevel(prev => prev + 1);
          setDropTime(1000 / (level + 1) + 200);
      }
  }, [lines, level]);

  const movePlayer = (dir: -1 | 1) => {
    if (!player || isPaused) return;
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft') movePlayer(-1);
    else if (e.key === 'ArrowRight') movePlayer(1);
    else if (e.key === 'ArrowDown') {
        drop();
    }
    else if (e.key === 'ArrowUp') rotatePlayer();
    else if (e.key === ' ') hardDrop();
    else if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
        setDropTime(isPaused ? (1000 / (level + 1) + 200) : null);
    }
  };

  useGameLoop(drop, dropTime);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-mono" onKeyDown={handleKeyDown} tabIndex={0} autoFocus>
        <h1 className="text-4xl font-bold tracking-widest mb-4 text-cyan-400">TETRIS</h1>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="relative border-4 border-slate-700 bg-slate-800 rounded-lg shadow-lg">
                <GameBoard board={board} player={player} />
                {isPaused && !isGameOver && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                      <p className="text-3xl text-white font-bold">PAUSED</p>
                  </div>
                )}
            </div>
            <aside className="flex flex-col gap-4 w-full md:w-64">
                <Scoreboard score={score} lines={lines} level={level} />
                {nextPieceShape && <NextPiecePreview shapeKey={nextPieceShape} />}
                <Leaderboard refreshKey={leaderboardKey} />
                <div className="p-4 bg-slate-800 rounded-lg border-2 border-slate-700">
                    <h3 className="text-lg font-bold mb-2 text-cyan-400">Controls</h3>
                    <ul className="text-sm space-y-1 text-slate-300">
                        <li><span className="font-bold w-16 inline-block">Left/Right:</span> Move</li>
                        <li><span className="font-bold w-16 inline-block">Up:</span> Rotate</li>
                        <li><span className="font-bold w-16 inline-block">Down:</span> Soft Drop</li>
                        <li><span className="font-bold w-16 inline-block">Space:</span> Hard Drop</li>
                        <li><span className="font-bold w-16 inline-block">P:</span> Pause/Resume</li>
                    </ul>
                </div>
            </aside>
        </div>
        {isGameOver && <GameOverModal score={score} onRestart={startGame} onScoreSubmitted={handleScoreSubmitted} />}
        {isPaused && !player && !isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
              <h2 className="text-5xl font-extrabold text-white mb-8">REACT TETRIS</h2>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transform hover:scale-105 transition-transform duration-200 text-2xl"
              >
                Start Game
              </button>
          </div>
        )}
    </div>
  );
};

export default App;