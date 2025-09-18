
// Bob Empire Configuration - Multi-Platform Support
// This file contains configuration for web, desktop, and mobile platforms

// Supabase Configuration (Authentication & Database)
export const SUPABASE_URL = 'your-supabase-url-here';
export const SUPABASE_ANON_KEY = 'your-supabase-anon-key-here';

// API Configuration - Use localhost for development
export const AI_API_URL = 'http://localhost:3000';

// Platform Detection
export const PLATFORM_CONFIG = {
  // Automatically detect platform type
  getPlatform() {
    if (typeof window !== 'undefined') {
      if (window.electronAPI) return 'electron';
      if (window.isMobile || /Mobi|Android/i.test(navigator.userAgent)) return 'mobile';
      return 'web';
    }
    return 'server';
  }
};

// Application Configuration
export const APP_CONFIG = {
  name: 'Bob Empire',
  version: '2.0.0',
  description: 'Global AI-Powered Commerce Platform',
  author: 'Bob Empire Team'
};
