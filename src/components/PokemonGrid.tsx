'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PokemonCard } from './PokemonCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { fetchPokemonList, fetchPokemonDetails } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

interface PokemonGridProps {
  initialPokemons?: Pokemon[];
  initialTotal?: number;
}

export function PokemonGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const search = searchParams.get('search') || '';
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = 20;
  
  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      try {
        const listResponse = await fetchPokemonList(limit, offset);
        const pokemonNames = listResponse.results.map(p => p.name);
        const pokemonDetails = await fetchPokemonDetails(pokemonNames);
        
        setPokemons(pokemonDetails.filter(Boolean) as Pokemon[]);
        setHasMore(!!listResponse.next);
      } catch (error) {
        console.error('Failed to load pokemons:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPokemons();
  }, [search, offset]);
  
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const newOffset = offset + limit;
    
    try {
      const listResponse = await fetchPokemonList(limit, newOffset);
      const pokemonNames = listResponse.results.map(p => p.name);
      const pokemonDetails = await fetchPokemonDetails(pokemonNames);
      
      setPokemons(prev => [...prev, ...pokemonDetails.filter(Boolean) as Pokemon[]]);
      setHasMore(!!listResponse.next);
      
      const params = new URLSearchParams(searchParams.toString());
      params.set('offset', newOffset.toString());
      router.push(`/?${params.toString()}`);
    } catch (error) {
      console.error('Failed to load more pokemons:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (pokemons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No Pokémon found</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {pokemons.map((pokemon) => {
          const image = pokemon.sprites.other?.['official-artwork']?.front_default 
            || pokemon.sprites.front_default 
            || '';
          const types = pokemon.types.map(t => t.type.name);
          
          return (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              id={pokemon.id}
              image={image}
              types={types}
            />
          );
        })}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  );
}
