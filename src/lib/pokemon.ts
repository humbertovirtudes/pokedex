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

interface EvolutionStep {
  name: string;
  id: number;
  condition?: string;
}

function parseEvolutionCondition(details: any[]): string {
  if (!details || details.length === 0) return '';

  const d = details[0];
  const trigger = d.trigger?.name || '';
  const itemName = d.item?.name?.replace('-', ' ') || '';
  const heldItem = d.held_item?.name?.replace('-', ' ') || '';
  const location = d.location?.name?.replace('-', ' ') || '';

  switch (trigger) {
    case 'level-up':
      if (d.min_level) return `Lv. ${d.min_level}`;
      if (d.min_happiness || d.min_beauty) return 'High Friendship';
      if (d.min_affection) return 'High Affection';
      if (d.time_of_day) return `Level at ${d.time_of_day}`;
      if (d.known_move_type) return `Knows ${d.known_move_type.name}`;
      if (d.known_move) return `Knows ${d.known_move.name}`;
      if (d.party_type) return `With ${d.party_type.name} type`;
      if (d.needs_overworld_rain) return 'Level in Rain';
      if (d.location) return `Level at ${location}`;
      return 'Level up';
    case 'use-item':
      if (itemName) return `Use ${itemName}`;
      return 'Use item';
    case 'trade':
      if (heldItem && d.trade) return `Trade with ${heldItem}`;
      if (d.trade) return 'Trade';
      return 'Trade';
    case 'spin':
      return 'Spin';
    case 'buddy':
      if (d.buddy_distance_km) return `Walk ${d.buddy_distance_km}km`;
      return 'Buddy walk';
    default:
      return trigger || 'Evolve';
  }
}

export function parseEvolutionChain(chain: any): EvolutionStep[] {
  const result: EvolutionStep[] = [];

  function traverse(node: any) {
    const idMatch = node.species.url.match(/\/(\d+)\//);
    const id = idMatch ? parseInt(idMatch[1]) : 0;
    const condition = parseEvolutionCondition(node.evolution_details);
    result.push({ name: node.species.name, id, condition });
    node.evolves_to.forEach(traverse);
  }

  traverse(chain.chain);
  return result;
}
