'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { PokemonCard } from './PokemonCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonNames } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

export function PokemonGrid() {
  const searchParams = useSearchParams();
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const search = searchParams.get('search') || '';
  const limit = 20;

  const loadPokemons = useCallback(async (currentOffset: number) => {
    try {
      const listResponse = await fetchPokemonList(limit, currentOffset);
      const pokemonNames = listResponse.results.map(p => p.name);
      const pokemonDetails = await fetchPokemonDetails(pokemonNames);
      const newPokemons = pokemonDetails.filter(Boolean) as Pokemon[];

      setAllPokemons(prev => {
        if (currentOffset === 0) return newPokemons;
        const existingIds = new Set(prev.map(p => p.id));
        return [...prev, ...newPokemons.filter(p => !existingIds.has(p.id))];
      });

      setHasMore(!!listResponse.next);
    } catch (error) {
      console.error('Failed to load pokemons:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [limit]);

  // Load initial batch or when search resets
  useEffect(() => {
    setAllPokemons([]);
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    loadPokemons(0);
  }, [search, loadPokemons]);

  // Search: fetch names only when searching, filter, and fetch details
  useEffect(() => {
    if (!search) return;

    let isCancelled = false;
    const fetchAndFilter = async () => {
      let names = allNames;
      if (names.length === 0) {
        names = await fetchAllPokemonNames();
        setAllNames(names);
      }
      
      if (isCancelled) return;

      const matchedNames = names.filter(name => name.toLowerCase().includes(search.toLowerCase()));
      const loadedNames = new Set(allPokemons.map(p => p.name));
      const missingNames = matchedNames.filter(name => !loadedNames.has(name));

      if (missingNames.length > 0) {
        const newDetails = await fetchPokemonDetails(missingNames);
        if (isCancelled) return;
        
        setAllPokemons(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          return [...prev, ...newDetails.filter(p => p && !existingIds.has(p.id))];
        });
      }
    };

    fetchAndFilter();
    return () => { isCancelled = true; };
  }, [search, allPokemons, allNames]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const newOffset = offset + limit;
    setOffset(newOffset);
    await loadPokemons(newOffset);
  };

  // Client-side search filtering
  const filteredPokemons = search
    ? allPokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : allPokemons;

  if (loading && allPokemons.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: limit }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredPokemons.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No Pokémon found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filteredPokemons.map((pokemon) => {
          const types = pokemon.types.map(t => t.type.name);

          return (
            <PokemonCard
              key={pokemon.id}
              name={pokemon.name}
              id={pokemon.id}
              image=""
              types={types}
            />
          );
        })}
      </div>

      {!search && hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-[#1A2B3C] border-4 border-black text-white font-mono hover:bg-[#233D4D] transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'LOADING...' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </>
  );
}
