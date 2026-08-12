import type { PokemonListResponse, Pokemon } from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch pokemon list');
  }
  
  return res.json();
}

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Pokemon not found');
    }
    throw new Error('Failed to fetch pokemon');
  }
  
  return res.json();
}

export async function fetchPokemonDetails(names: string[]): Promise<Pokemon[]> {
  const promises = names.map(name => fetchPokemon(name).catch(() => null));
  const results = await Promise.all(promises);
  return results.filter(Boolean) as Pokemon[];
}
