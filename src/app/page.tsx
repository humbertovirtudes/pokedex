import { Suspense } from 'react';
import PokedexClient from './PokedexClient';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { getCaughtPokemonIds } from '@/lib/supabase/auth';
import { hasConfig } from '@/lib/supabase/server';

export default async function Home() {
  const caughtIds = hasConfig ? await getCaughtPokemonIds() : [];

  return (
    <Suspense fallback={
      <div className="h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="pokedex-frame rounded-3xl p-6 w-full max-w-7xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative">
                <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-black overflow-hidden">
                  <div className="w-full h-1/2 bg-white" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black" />
                </div>
              </div>
              <h1 className="text-4xl pokedex-font text-white tracking-wider">POKéDEX</h1>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
          </div>
          <div className="screen-area rounded-xl flex-1 overflow-hidden flex flex-col relative">
            <div className="crt-effect">
              <div className="scroll-screen h-full px-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PokedexClient caughtIds={caughtIds} />
    </Suspense>
  );
}
