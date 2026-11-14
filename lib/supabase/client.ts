import { createClient } from "@supabase/supabase-js";

/**
 * =============================================================================
 * SAZAIRA — BROWSER / PUBLIC SUPABASE CLIENT
 * =============================================================================
 * Uses the public Supabase URL and anonymous key.
 * Safe to use in Client Components and public read requests.
 * Protected by Supabase Row Level Security (RLS) policies.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl && typeof window !== "undefined") {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL is not set. Supabase client calls will fail until configured in .env.local."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: false,
    },
  }
);
