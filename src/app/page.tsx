import { Suspense } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PokemonGrid } from '@/components/PokemonGrid';

export const metadata = {
  title: 'PokéDEX - Next.js App',
  description: 'Explore Pokémon with the PokeAPI',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-6">PokéDEX</h1>
          <Suspense fallback={<div className="max-w-md mx-auto h-12 bg-gray-900 rounded-xl animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </header>
        
        <Suspense fallback={<PokemonGridSkeleton />}>
          <PokemonGrid />
        </Suspense>
      </div>
    </main>
  );
}

function PokemonGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 animate-pulse">
          <div className="aspect-square bg-gray-800 rounded-xl mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-800 rounded-full w-16" />
              <div className="h-6 bg-gray-800 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
