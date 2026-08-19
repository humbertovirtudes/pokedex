import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getServerUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return user
}
