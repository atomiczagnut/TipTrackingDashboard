import dotenv from 'dotenv';
dotenv.config();

// ADD THESE DEBUG LINES:
console.log('=== ENV VARS DEBUG ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
console.log('=====================');

import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { supabase } from './db/supabase.js';

// ES modules don't have __dirname, so we need to recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(join(__dirname, '..', 'client')));

// Route to fetch all tips data
app.get('/data', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tips')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching data:', error.message);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }

        res.json(data);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to add a new shift
app.post('/data', async (req, res) => {
    try {
        const { date, day_of_week, am_or_pm, hours_worked, tips_earned } = req.body;

        // Validate required fields
        if (!date || !day_of_week || !am_or_pm || !hours_worked || !tips_earned) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const { data, error } = await supabase
            .from('tips')
            .insert([
                {
                    date,
                    day_of_week,
                    am_or_pm,
                    hours_worked: parseFloat(hours_worked),
                    tips_earned: parseFloat(tips_earned)
                }
            ])
            .select();

        if (error) {
            console.error('Error inserting data:', error.message);
            return res.status(500).json({ error: 'Failed to save shift' });
        }

        res.status(201).json({ message: 'Shift saved successfully', data });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});