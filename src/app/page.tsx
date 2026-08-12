import { Suspense } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PokemonGrid } from '@/components/PokemonGrid';

export const metadata = {
  title: 'PokéDEX - Classic Pokédex Device',
  description: 'Explore Pokémon with the classic Pokédex interface',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="pokedex-frame rounded-[3rem] p-6 max-w-6xl w-full">
        <div className="bg-[#DC0A2D] rounded-[2.5rem] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-black relative">
                <div className="absolute inset-2 rounded-full bg-red-600"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h1 className="pokedex-font text-white text-sm">POKéDEX</h1>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6] led-glow"></div>
              <div className="w-3 h-3 rounded-full bg-[#6B2118]"></div>
              <div className="w-3 h-3 rounded-full bg-[#1B4332]"></div>
            </div>
          </div>
          
          <div className="screen-area rounded-3xl p-6 crt-effect">
            <div className="mb-6">
              <Suspense fallback={<div className="max-w-md mx-auto h-12 bg-gray-900 rounded-xl animate-pulse" />}>
                <SearchBar />
              </Suspense>
            </div>
            
            <Suspense fallback={<PokemonGridSkeleton />}>
              <PokemonGrid />
            </Suspense>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="w-24 h-2 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PokemonGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="bg-gray-900 rounded-xl border-2 border-black p-4 animate-pulse">
          <div className="aspect-square bg-gray-800 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-800 rounded w-16" />
              <div className="h-6 bg-gray-800 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
