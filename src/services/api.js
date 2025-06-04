import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Interceptor setup for authentication
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    supabase.client.headers = {
      ...supabase.client.headers,
      'Authorization': `Bearer ${session.access_token}`
    };
  }
});

export default supabase;