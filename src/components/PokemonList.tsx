'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPokemonList, fetchPokemonDetails } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

export function PokemonList() {
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
      <div className="space-y-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-[#1E293B] border-4 border-black p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          </div>
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
      <div className="space-y-2 mb-8">
        {pokemons.map((pokemon) => {
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
          
          return (
            <Link key={pokemon.id} href={`/pokemon/${pokemon.name}`}>
              <div className="group flex items-center gap-4 bg-[#1E293B] border-4 border-black p-4 hover:bg-[#233D4D] transition-all duration-300">
                <div className="w-12 h-12 bg-[#1A2B3C] border-2 border-black flex items-center justify-center flex-shrink-0">
                  <img
                    src={image}
                    alt={pokemon.name}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-sm text-gray-400 font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
                  <span className="text-lg font-mono text-white uppercase">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-[#1A2B3C] border-4 border-black text-white font-mono hover:bg-[#233D4D] transition-colors disabled:opacity-50 pokedex-button"
          >
            {loadingMore ? 'LOADING...' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </>
  );
}
