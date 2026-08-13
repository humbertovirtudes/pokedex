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

export async function getCaughtPokemonIds(): Promise<number[]> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  try {
    const { data } = await supabase
      .from('caught_pokemon')
      .select('pokemon_id')
      .eq('user_id', user.id)

    return data?.map((row: any) => row.pokemon_id) || []
  } catch {
    return []
  }
}
