'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { PokemonCard } from './PokemonCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { CaughtToggle } from './CaughtToggle';
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonNames } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

interface PokemonGridProps {
  caughtIds: number[];
}

export function PokemonGrid({ caughtIds }: PokemonGridProps) {
  const searchParams = useSearchParams();
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

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

  // Search: fetch names only when searching
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

  const doLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const newOffset = offset + limit;
    setOffset(newOffset);
    await loadPokemons(newOffset);
  };

  // Infinite scroll via IntersectionObserver
  const lastPokemonRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!mounted || loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore && !search) {
          doLoadMore();
        }
      }, { rootMargin: '200px' });

      if (node) observerRef.current.observe(node);
    },
    [mounted, loading, loadingMore, hasMore, search, doLoadMore]
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {filteredPokemons.map((pokemon, index) => {
          const types = pokemon.types.map(t => t.type.name);
          const isLast = index === filteredPokemons.length - 1;
          const isCaught = caughtIds.includes(pokemon.id);

          return (
            <div key={pokemon.id} ref={isLast ? lastPokemonRef : undefined} className="relative">
              <PokemonCard
                name={pokemon.name}
                id={pokemon.id}
                image=""
                types={types}
              />
              <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                <CaughtToggle
                  pokemonId={pokemon.id}
                  initiallyCaught={isCaught}
                />
              </div>
            </div>
          );
        })}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      {!search && hasMore && !loadingMore && (
        <div className="text-center py-4">
          <button
            onClick={doLoadMore}
            className="px-6 py-3 bg-[#1A2B3C] border-4 border-black text-white font-mono hover:bg-[#233D4D] transition-colors"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </>
  );
}
