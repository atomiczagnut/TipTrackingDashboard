import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

console.log('Loading Supabase with URL:', config.supabaseUrl);

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);