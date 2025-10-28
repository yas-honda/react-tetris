import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Score } from '../types';

interface LeaderboardProps {
  refreshKey: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ refreshKey }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      if (!supabase) return; // Guard against null client
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        setScores(data || []);
      } catch (err: any) {
        setError('Could not fetch scores.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [refreshKey]);

  return (
    <div className="p-4 bg-slate-800 rounded-lg border-2 border-slate-700">
      <h3 className="text-lg font-bold mb-3 text-center text-cyan-400">LEADERBOARD</h3>
      {!isSupabaseConfigured ? (
        <p className="text-center text-sm text-slate-400">
          Leaderboard is not configured. Please set up Supabase credentials in `lib/supabaseClient.ts`.
        </p>
      ) : loading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : scores.length === 0 ? (
        <p className="text-center text-slate-400">No scores yet. Be the first!</p>
      ) : (
        <ol className="space-y-2 text-sm">
          {scores.map((score, index) => (
            <li key={score.id} className="flex justify-between items-center bg-slate-900 p-2 rounded">
              <span className="font-semibold text-slate-300">
                <span className="inline-block w-6 text-slate-500">{index + 1}.</span>
                {score.player_name}
              </span>
              <span className="font-bold text-yellow-400">{score.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
