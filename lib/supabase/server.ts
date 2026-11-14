import { createClient } from "@supabase/supabase-js";

/**
 * =============================================================================
 * SAZAIRA — SERVER-SIDE SUPABASE ADMIN CLIENT
 * =============================================================================
 * ⚠️ SECURITY NOTICE:
 * This client uses the SUPABASE_SERVICE_ROLE_KEY which bypasses Row Level
 * Security (RLS). It MUST ONLY be imported and executed in server-side code
 * (Route Handlers, Server Actions, Server Components).
 *
 * NEVER import this file into client components or expose the service role key
 * to the browser, as it grants full unrestricted access to the database.
 * =============================================================================
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured for this storefront. Orders and reviews are handled on WhatsApp."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
