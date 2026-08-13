'use client'

import { useState, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { createClientComponent, hasConfig } from '@/lib/supabase/client'

export function UserMenu() {
  const supabase = hasConfig ? createClientComponent() : null
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email || '')
    })
  }, [supabase])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.href = '/sign-in'
  }

  if (!supabase) {
    return null
  }

  return (
    <div className="flex items-center gap-2 bg-[#1E293B] border-4 border-black px-3 py-1">
      <User className="w-4 h-4 text-blue-400" />
      <span className="text-xs text-gray-300 font-mono truncate max-w-[120px]">{email}</span>
      <button
        onClick={handleSignOut}
        className="text-gray-500 hover:text-red-400 transition-colors"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  )
}
