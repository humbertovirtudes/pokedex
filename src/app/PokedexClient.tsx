'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PokemonGrid } from '@/components/PokemonGrid';
import { PokemonList } from '@/components/PokemonList';
import { ViewToggle } from '@/components/ViewToggle';
import { UserMenu } from '@/components/UserMenu';

interface PokedexClientProps {
  caughtIds: number[];
}

export default function PokedexClient({ caughtIds }: PokedexClientProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="pokedex-frame rounded-3xl p-6 w-full max-w-7xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Poké Ball Logo */}
            <div className="w-12 h-12 relative">
              <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-black overflow-hidden">
                <div className="w-full h-1/2 bg-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black" />
              </div>
            </div>

            <h1 className="text-4xl pokedex-font text-white tracking-wider">
              POKéDEX
            </h1>
          </div>

          <UserMenu />
        </div>

        {/* LED Indicators + View Toggle */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500 led-glow" />
            <div className="w-4 h-4 rounded-full bg-red-500 led-glow" />
            <div className="w-4 h-4 rounded-full bg-green-500 led-glow" />
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {/* Screen Area - This scrolls */}
        <div className="screen-area rounded-xl flex-1 overflow-hidden flex flex-col relative">
          <div className="crt-effect">
            <div className="scroll-screen h-full">
              {/* Search Bar */}
              <div className="sticky top-0 bg-[#233D4D] pb-2 z-20 px-4 pt-4">
                <SearchBar />
              </div>

              {/* Pokemon Content */}
              <div className="px-4 pb-4">
                {view === 'grid' ? (
                  <PokemonGrid caughtIds={caughtIds} />
                ) : (
                  <PokemonList caughtIds={caughtIds} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
