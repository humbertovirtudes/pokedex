'use client'

import { useState } from 'react'
import { createClientComponent, hasConfig } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const router = useRouter()
  const supabase = hasConfig ? createClientComponent() : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password: '',
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Check your email for the sign-in link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Check your email for the sign-in link!')
        }
      }
    } catch (err) {
      setMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-mono text-gray-300 block mb-1">EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-[#1A2B3C] border-2 border-black text-white font-mono px-4 py-2 focus:outline-none focus:border-blue-500"
          placeholder="trainer@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-mono uppercase py-3 border-4 border-black transition-colors disabled:opacity-50"
      >
        {loading ? 'SENDING...' : mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        className="w-full text-gray-400 font-mono text-sm hover:text-white transition-colors"
      >
        {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
      </button>

      {message && (
        <p className="text-center font-mono text-sm text-green-400">{message}</p>
      )}
    </form>
  )
}
