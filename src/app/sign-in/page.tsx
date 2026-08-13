import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { SignInForm } from '@/components/SignInForm'

export default async function SignInPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="pokedex-frame rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 rounded-full bg-red-500 border-4 border-black overflow-hidden">
              <div className="w-full h-1/2 bg-white" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-black" />
            </div>
          </div>
          <h1 className="text-2xl pokedex-font text-white tracking-wider mb-2">POKéDEX</h1>
          <p className="text-gray-400 font-mono">Sign in to track your catches</p>
        </div>

        <div className="screen-area rounded-xl p-6">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
