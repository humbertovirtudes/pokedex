'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonNames } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

export function PokemonList() {
  const searchParams = useSearchParams();
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  if (filteredPokemons.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No Pokémon found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-4">
        {filteredPokemons.map((pokemon, index) => {
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
          const isLast = index === filteredPokemons.length - 1;

          return (
            <div key={pokemon.id} ref={isLast ? lastPokemonRef : undefined}>
              <Link href={`/pokemon/${pokemon.name}`}>
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
