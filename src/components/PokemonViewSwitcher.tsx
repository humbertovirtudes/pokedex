'use client';

import { useSearchParams } from 'next/navigation';
import { PokemonGrid } from './PokemonGrid';
import { PokemonList } from './PokemonList';

export function PokemonViewSwitcher() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'grid';
  
  if (view === 'list') {
    return <PokemonList />;
  }
  
  return <PokemonGrid />;
}
