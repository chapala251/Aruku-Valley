import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_anon_public_key_here';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'araku-admin-auth',
  }
});

export const ADMIN_EMAIL = 'arakuecostays@gmail.com'; // change to your admin email
