
// Environment variables for Supabase configuration
// For Vercel deployment, set these as environment variables in your project settings:
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

export const SUPABASE_URL = 
  import.meta.env?.VITE_SUPABASE_URL || 
  (typeof window !== 'undefined' && window.VITE_SUPABASE_URL) ||
  "REPLACE_WITH_SUPABASE_URL";

export const SUPABASE_ANON_KEY = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 
  (typeof window !== 'undefined' && window.VITE_SUPABASE_ANON_KEY) ||
  "REPLACE_WITH_SUPABASE_ANON_KEY";

// Validation check
if (typeof window !== 'undefined' && (
  SUPABASE_URL === "REPLACE_WITH_SUPABASE_URL" || 
  SUPABASE_ANON_KEY === "REPLACE_WITH_SUPABASE_ANON_KEY"
)) {
  console.warn("⚠️ Supabase configuration not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
}
