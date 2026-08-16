'use client'

import { useState } from 'react'
import { createClientComponent, hasConfig } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = hasConfig ? createClientComponent() : null
  const router = useRouter()

  const signInAnonymously = async () => {
    if (!supabase) return
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInAnonymously()
      if (error) {
        setMessage(error.message)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setMessage('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={signInAnonymously}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-mono uppercase py-3 border-4 border-black transition-colors disabled:opacity-50"
      >
        {loading ? 'LOADING...' : 'START AS GUEST'}
      </button>

      <p className="text-center font-mono text-xs text-gray-500">
        Instant access — your catches are saved in this browser
      </p>

      {message && (
        <p className="text-center font-mono text-sm text-red-400">{message}</p>
      )}
    </div>
  )
}
