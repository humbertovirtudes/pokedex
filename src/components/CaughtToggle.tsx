'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { toggleCaught } from '@/db/actions'

interface CaughtToggleProps {
  pokemonId: number
  initiallyCaught: boolean
}

export function CaughtToggle({ pokemonId, initiallyCaught }: CaughtToggleProps) {
  const [caught, setCaught] = useState(initiallyCaught)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      await toggleCaught(pokemonId)
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
