import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('[Config] SUPABASE_URL wajib ada di .env');
}
if (!supabaseServiceRoleKey) {
  throw new Error('[Config] SUPABASE_SERVICE_ROLE_KEY wajib ada di .env');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
