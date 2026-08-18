import type { PokemonListResponse, Pokemon, PokemonSpecies } from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!res.ok) {
    throw new Error('Failed to fetch pokemon list');
  }

  return res.json();
}

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);

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

// Fetch all 1351 Pokemon names for static generation
export async function fetchAllPokemonNames(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1351`);
  if (!res.ok) throw new Error('Failed to fetch all pokemon');
  const data = await res.json();
  return data.results.map((p: { name: string }) => p.name);
}

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch pokemon species');
  }
  
  return res.json();
}

export async function fetchEvolutionChain(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch evolution chain');
  }
  return res.json();
}

// Parse evolution chain into a flat list of {name, id, min_level}
export function parseEvolutionChain(chain: any): { name: string; id: number; min_level?: number }[] {
  const result: { name: string; id: number; min_level?: number }[] = [];

  function traverse(node: any) {
    // Get Pokémon ID from the species URL
    const idMatch = node.species.url.match(/\/(\d+)\//);
    const id = idMatch ? parseInt(idMatch[1]) : 0;
    const minLevel = node.evolution_details[0]?.min_level;
    result.push({ name: node.species.name, id, min_level: minLevel });
    node.evolves_to.forEach(traverse);
  }

  traverse(chain.chain);
  return result;
}
