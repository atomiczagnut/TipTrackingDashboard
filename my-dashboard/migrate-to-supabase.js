import { createClient } from '@supabase/supabase-js';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const SUPABASE_URL = 'https://fofhfxivzrxkpnyjmtvb.supabase.co';
const SUPABASE_SERVICE_KEY = 'your-service-role-key'; // Not anon key!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const db = new sqlite3.Database('tips.db');
const dbAll = promisify(db.all.bind(db));

async function migrateTips() {
  try {
    // Get all tips from SQLite
    const tips = await dbAll('SELECT * FROM tips');
    
    console.log(`Found ${tips.length} tips to migrate`);
    
    // Transform and insert into Supabase
    for (const tip of tips) {
      const { error } = await supabase
        .from('tips')
        .insert({
          user_id: 'YOUR_USER_ID', // Get from Supabase auth
          date: tip.date,
          amount: tip.amount,
          hours: tip.hours,
          shift: tip.shift,
          notes: tip.notes
        });
      
      if (error) {
        console.error('Error inserting tip:', error);
      } else {
        console.log(`✓ Migrated tip from ${tip.date}`);
      }
    }
    
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateTips();