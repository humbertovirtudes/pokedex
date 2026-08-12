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
  // Use ID-based sprite URL as primary (more reliable than PokeAPI redirect)
  const primaryImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  const image = primaryImage;
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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="pokedex-frame rounded-[3rem] p-6 max-w-6xl w-full">
        <div className="bg-[#DC0A2D] rounded-[2.5rem] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-black relative">
                <div className="absolute inset-2 rounded-full bg-red-600"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h1 className="pokedex-font text-white text-sm">POKéDEX</h1>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs">BACK</span>
            </Link>
          </div>
          
          <div className="screen-area rounded-3xl p-6 crt-effect">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-[#1E293B] border-4 border-black p-6">
                <div className="aspect-square bg-[#1A2B3C] border-2 border-black flex items-center justify-center overflow-hidden mb-6">
                  <img
                    src={image}
                    alt={pokemon.name}
                    className="w-full h-full object-contain max-h-96"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImage;
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h1 className="text-2xl font-mono text-white uppercase">{capitalizedName}</h1>
                    <span className="text-lg text-gray-400 font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {types.map((type) => (
                      <TypeBadge key={type} type={type} size="lg" />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black">
                    <div className="bg-[#1A2B3C] border-2 border-black p-3">
                      <span className="text-gray-400 text-xs font-mono">HEIGHT</span>
                      <p className="text-white font-mono text-sm">{(pokemon.height / 10).toFixed(1)} M</p>
                    </div>
                    <div className="bg-[#1A2B3C] border-2 border-black p-3">
                      <span className="text-gray-400 text-xs font-mono">WEIGHT</span>
                      <p className="text-white font-mono text-sm">{(pokemon.weight / 10).toFixed(1)} KG</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1E293B] border-4 border-black p-6">
                  <h2 className="text-lg font-mono text-white mb-4 uppercase">Base Stats</h2>
                  <div className="space-y-3">
                    {stats.map((stat) => (
                      <StatBar key={stat.name} name={stat.name} value={stat.value} />
                    ))}
                  </div>
                </div>

                <div className="bg-[#1E293B] border-4 border-black p-6">
                  <h2 className="text-lg font-mono text-white mb-4 uppercase">Abilities</h2>
                  <div className="space-y-2">
                    {abilities.map((ability, index) => (
                      <div key={index} className="flex items-center justify-between py-2 bg-[#1A2B3C] border-2 border-black p-2">
                        <span className="text-white font-mono text-sm uppercase">{ability.name.replace('-', ' ')}</span>
                        {ability.isHidden && (
                          <span className="text-xs px-2 py-1 bg-[#DC0A2D] border-2 border-black font-mono text-white">HIDDEN</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
