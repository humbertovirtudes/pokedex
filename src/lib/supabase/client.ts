import { createBrowserClient } from '@supabase/ssr'

const hasConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClientComponent() {
  if (!hasConfig) {
    return null
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export { hasConfig }
