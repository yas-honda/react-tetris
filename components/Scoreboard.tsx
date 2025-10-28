
import React from 'react';

interface ScoreboardProps {
  score: number;
  lines: number;
  level: number;
}

const StatDisplay: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="flex justify-between items-center bg-slate-900 p-2 rounded">
        <span className="text-sm font-bold text-slate-400">{label}</span>
        <span className="text-lg font-bold text-yellow-400 tracking-wider">{value}</span>
    </div>
);

export const Scoreboard: React.FC<ScoreboardProps> = ({ score, lines, level }) => {
  return (
    <div className="w-full p-4 bg-slate-800 rounded-lg border-2 border-slate-700 space-y-2">
      <StatDisplay label="SCORE" value={score} />
      <StatDisplay label="LINES" value={lines} />
      <StatDisplay label="LEVEL" value={level} />
    </div>
  );
};
