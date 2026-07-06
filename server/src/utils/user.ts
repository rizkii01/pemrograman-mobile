import { supabaseAdmin } from '../config/supabase';

/**
 * Lookup local integer user ID dari Supabase UUID.
 * Dipakai di semua controller yang butuh `user_id` (integer FK).
 */
export const lookupUserId = async (supabaseId: string): Promise<number | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('supabase_id', supabaseId)
    .maybeSingle();

  if (error) {
    console.error('[lookupUserId] Error:', error.message);
    return null;
  }
  return data?.id ?? null;
};
