
import React from 'react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-10">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl text-center border-4 border-red-500">
        <h2 className="text-4xl font-extrabold text-red-500 mb-2">GAME OVER</h2>
        <p className="text-lg text-slate-300 mb-4">Your Score:</p>
        <p className="text-5xl font-bold text-yellow-400 mb-8">{score}</p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 transform hover:scale-105 transition-transform duration-200 text-xl"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
