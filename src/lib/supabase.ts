import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Harus sama dengan SUPABASE_URL di server/.env
const SUPABASE_URL = 'https://mecsthfzgmrgcjjqrill.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3N0aGZ6Z21yZ2NqanFyaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMzk5NzEsImV4cCI6MjA5ODcxNTk3MX0.03-9wGpY_IhKE3vNcyyFwrHooUb9RbrgJ-j_SjMqf5o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

