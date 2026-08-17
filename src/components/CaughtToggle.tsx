'use client'

import { useState, useEffect } from 'react'
import { createClientComponent, hasConfig } from '@/lib/supabase/client'
import { CheckCircle, Circle } from 'lucide-react'

interface CaughtToggleProps {
  pokemonId: number
  initiallyCaught: boolean
}

export function CaughtToggle({ pokemonId, initiallyCaught }: CaughtToggleProps) {
  const [caught, setCaught] = useState(initiallyCaught)
  const [loading, setLoading] = useState(false)
  const supabase = hasConfig ? createClientComponent() : null

  // Re-fetch caught status on mount in case it changed
  useEffect(() => {
    if (!supabase) return
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('caught_pokemon')
        .select('pokemon_id')
        .eq('user_id', user.id)
        .eq('pokemon_id', pokemonId)
        .single()

      if (data) {
        setCaught(true)
      }
    }
    fetchStatus()
  }, [supabase, pokemonId])

  const toggle = async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (caught) {
        await supabase
          .from('caught_pokemon')
          .delete()
          .eq('user_id', user.id)
          .eq('pokemon_id', pokemonId)
      } else {
        await supabase
          .from('caught_pokemon')
          .insert({ pokemon_id: pokemonId, user_id: user.id })
      }
      setCaught(!caught)
    } catch (err) {
      console.error('Failed to toggle caught:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="p-2 hover:bg-[#233D4D] border-2 border-black transition-colors disabled:opacity-50"
      title={caught ? 'Mark as not caught' : 'Mark as caught'}
    >
      {caught ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <Circle className="w-5 h-5 text-gray-500" />
      )}
    </button>
  )
}
