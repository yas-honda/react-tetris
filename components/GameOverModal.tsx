import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  onScoreSubmitted: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart, onScoreSubmitted }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !supabase) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('scores')
        .insert([{ player_name: name, score: score }]);
      
      if (error) throw error;
      
      setSubmitted(true);
      onScoreSubmitted();
    } catch (err: any) {
      setError('Failed to submit score. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-10">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl text-center border-4 border-red-500 w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-red-500 mb-2">GAME OVER</h2>
        <p className="text-lg text-slate-300 mb-4">Your Score:</p>
        <p className="text-5xl font-bold text-yellow-400 mb-6">{score}</p>
        
        {isSupabaseConfigured && !submitted && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-slate-900 text-white p-3 rounded-lg border-2 border-slate-600 focus:border-cyan-500 focus:outline-none"
              maxLength={20}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 disabled:bg-slate-600 transition-colors duration-200 text-xl"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        )}
        
        {submitted && (
            <p className="text-green-400 font-bold text-xl mb-6">Score submitted!</p>
        )}

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
