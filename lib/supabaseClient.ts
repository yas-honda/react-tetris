import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// TODO: Vercelの環境変数を設定するか、以下のプレースホルダーをあなたのSupabaseプロジェクトの値に置き換えてください。
//
// SupabaseプロジェクトのURLとanon (public)キーは、プロジェクト設定の「API」セクションで確認できます。
//
// 例:
// const supabaseUrl = 'https://abcdefghijklmnopqrst.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
// =============================================================================

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

/**
 * ユーザーがSupabaseの認証情報を設定したかどうかを確認します。
 * これにより、設定が完了していない場合にUIで適切なメッセージを表示できます。
 */
export const isSupabaseConfigured = 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

/**
 * Supabaseクライアントをエクスポートします。
 * 認証情報が設定されていない場合、API呼び出しは失敗します。
 * This is now nullable to prevent the app from crashing on startup if credentials are not set.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
