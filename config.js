
// Frontend configuration - environment aware
const isProduction = window.location.protocol === 'https:' || window.location.hostname !== 'localhost';
const baseURL = isProduction 
  ? window.location.origin 
  : "http://localhost:3000";

// Supabase configuration - should be set as environment variables in production
export const SUPABASE_URL = window.VITE_SUPABASE_URL || "your-supabase-url-here";
export const SUPABASE_ANON_KEY = window.VITE_SUPABASE_ANON_KEY || "your-supabase-anon-key-here";

// AI Configuration for frontend
export const AI_API_URL = `${baseURL}/api/ai`;
export const SUPER_AI_API_URL = `${baseURL}/api/super-ai`;
export const AUTH_API_URL = `${baseURL}/api/auth`;
export const PRODUCTS_API_URL = `${baseURL}/api/products`;

// App configuration
export const APP_CONFIG = {
  name: "Bob Empire",
  version: "2.2.0",
  description: "Global AI-Powered Commerce Platform",
  baseURL: baseURL
};
