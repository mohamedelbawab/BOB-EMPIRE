
// Environment configuration with fallbacks
export const SUPABASE_URL = 
  typeof window !== 'undefined' ? 
    (window.VITE_SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-ref.supabase.co") :
    (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://your-project-ref.supabase.co");

export const SUPABASE_ANON_KEY = 
  typeof window !== 'undefined' ? 
    (window.VITE_SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key") :
    (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "your-anon-key");

// Additional configuration
export const CONFIG = {
  appName: "Bob Empire",
  version: "v2.2",
  adminPassword: process.env.ADMIN_PASSWORD || "Bob@Bob0000",
  turbo: false,
  n8nBaseUrl: process.env.N8N_BASE_URL || "http://localhost:5678",
  
  // API Keys
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  
  // Platform Keys
  platforms: {
    amazon: process.env.AMAZON_API_KEY || "",
    shopify: process.env.SHOPIFY_API_KEY || "",
    aliexpress: process.env.ALIEXPRESS_API_KEY || "",
    alibaba: process.env.ALIBABA_API_KEY || "",
  },
  
  // Payment Keys
  payments: {
    stripeSecret: process.env.STRIPE_SECRET_KEY || "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID || "",
  }
};
