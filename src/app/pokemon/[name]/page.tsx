import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TypeBadge } from '@/components/TypeBadge';
import { StatBar } from '@/components/StatBar';
import { fetchPokemon } from '@/lib/pokemon';
import type { Pokemon } from '@/lib/types';

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { name } = await params;
  try {
    const pokemon = await fetchPokemon(name);
    return {
      title: `${pokemon.name} - PokéDEX`,
    };
  } catch {
    return {
      title: 'Pokémon not found - PokéDEX',
    };
  }
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { name } = await params;
  
  let pokemon: Pokemon;
  try {
    pokemon = await fetchPokemon(name.toLowerCase());
  } catch {
    notFound();
  }

  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const image = pokemon.sprites.other?.['official-artwork']?.front_default 
    || pokemon.sprites.front_default 
    || '';
  const types = pokemon.types.map(t => t.type.name);
  const abilities = pokemon.abilities.map(a => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
  }));

  const stats = pokemon.stats.map(s => ({
    name: s.stat.name,
    value: s.base_stat,
  }));

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to PokéDEX
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
            <div className="aspect-square bg-gray-950 rounded-xl flex items-center justify-center overflow-hidden mb-6">
              <img
                src={image}
                alt={pokemon.name}
                className="w-full h-full object-contain max-h-96"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h1 className="text-4xl font-bold capitalize">{capitalizedName}</h1>
                <span className="text-xl text-gray-500 font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {types.map((type) => (
                  <TypeBadge key={type} type={type} size="lg" />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <span className="text-gray-500 text-sm">Height</span>
                  <p className="text-white font-mono">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Weight</span>
                  <p className="text-white font-mono">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
              <div className="space-y-3">
                {stats.map((stat) => (
                  <StatBar key={stat.name} name={stat.name} value={stat.value} />
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-semibold mb-4">Abilities</h2>
              <div className="space-y-2">
                {abilities.map((ability, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-white capitalize">{ability.name.replace('-', ' ')}</span>
                    {ability.isHidden && (
                      <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">Hidden</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
