// ===== SUPABASE CLIENT SETUP =====
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env.local
// For local dev without Supabase, set both to 'mock' in .env.local
// DO NOT commit .env.local to git. DO NOT use secrets directly in this file.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Dev mock mode: enable when either env var equals 'mock' or either is missing
export const IS_MOCK_AUTH = SUPABASE_URL === 'mock' || SUPABASE_ANON_KEY === 'mock' || !SUPABASE_URL || !SUPABASE_ANON_KEY

// Create client only when not in mock mode
export const supabase = IS_MOCK_AUTH ? null : createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
