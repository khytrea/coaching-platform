import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

// NEVER import this file in a Client Component — the service role key
// bypasses RLS entirely. Only use inside route handlers / server actions.
export function createAdminClient() {
  return createClient<Database>(
    process.env.https://bwektkhirwngitphiydc.supabase.co/rest/v1/!,
    process.env.yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZWt0a2hpcnduZ2l0cGhpeWRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njc5NzA3NywiZXhwIjoyMTAyMzczMDc3fQ.65yYcxWu3TaUrN6pTgdLHfbnk6Vo2BIipdnp_Lee1tc!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}