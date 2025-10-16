import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('=== ENV DEBUG ===');
console.log('All env vars:', import.meta.env);
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'YES' : 'NO');
console.log('================');