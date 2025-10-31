import { supabase } from './db/supabase.js';

// Check if user is logged in
export async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Sign up with email and password
export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signup({
        email: email,
        password: password,
    });

    if (error) {
        console.error("Error signing up:", error);
        alert("Sign up failed: " + error.message);
        return null;
    }

    //Supabase requires e-mail confirmation
    if (data.user && !data.user.confirmed_at) {
        alert("Sign up successful!  Please verify your e-mail to confirm your account.");
    }

    return data.user;
}

// Sign in with email and password
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error("Error siging in:", error);

    }
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