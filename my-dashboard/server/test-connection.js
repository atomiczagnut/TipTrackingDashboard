import { supabase } from './db/supabase.js';

async function testConnection() {
    console.log("Testing Supabase connection...");

    const { data, error } = await supabase
        .from("tips")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Connection failed:", error.message);
    } else {
        console.log("Connection succesful!");
        console.log("Sample data:", data);
    }
}

testConnection();