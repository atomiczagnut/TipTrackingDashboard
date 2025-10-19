import { supabase } from './db/supbase.js';

// Check if user is logged in
export async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Sign in with Google
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in with Google");
    }
}

// Sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
    } else {
        window.location.reload();
    }
}