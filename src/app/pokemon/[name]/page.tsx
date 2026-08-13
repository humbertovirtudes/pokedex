import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { fetchPokemonDetails, fetchPokemonSpecies } from '@/lib/pokemon';
import { PokemonImage } from '@/components/PokemonImage';
import { TypeBadge } from '@/components/TypeBadge';
import { StatBar } from '@/components/StatBar';

export default async function PokemonDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemonList = await fetchPokemonDetails([name]);
  const pokemon = pokemonList[0];

  if (!pokemon) {
    notFound();
  }

  // Fetch species data for flavor text
  let flavorText = '';
  let genus = '';
  try {
    const speciesData = await fetchPokemonSpecies(pokemon.id);
    genus = (speciesData as any).genera?.find((g: any) => g.language.name === 'en')?.genus || '';
    const flavorEntry = speciesData.flavor_text_entries?.find((e: any) => e.language.name === 'en');
    flavorText = flavorEntry?.flavor_text?.replace(/\f/g, ' ') || '';
  } catch {
    // Flavor text is optional
  }

  const types = pokemon.types.map(t => t.type.name);

  return (
    <div className="h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="pokedex-frame rounded-3xl p-6 w-full max-w-7xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 bg-[#1E293B] border-4 border-black px-4 py-2 hover:bg-[#233D4D] transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
                <span className="text-white font-mono">BACK</span>
              </div>
            </Link>

            <div>
              <h1 className="text-3xl pokedex-font text-white uppercase">
                {pokemon.name}
              </h1>
              <p className="text-gray-400 font-mono">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
          </div>
        </div>

        {/* LED Indicators */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-blue-500 led-glow" />
          <div className="w-4 h-4 rounded-full bg-red-500 led-glow" />
          <div className="w-4 h-4 rounded-full bg-green-500 led-glow" />
        </div>

        {/* Screen Area - This scrolls */}
        <div className="screen-area rounded-xl flex-1 overflow-hidden flex flex-col relative">
          <div className="crt-effect">
            <div className="scroll-screen h-full">
              <div className="px-4 pt-4 pb-4">
                {/* Pokemon Image */}
                <div className="flex justify-center mb-6">
                  <PokemonImage pokemonId={pokemon.id} pokemonName={pokemon.name} className="w-48 h-48 object-contain" />
                </div>

                {/* Types */}
                <div className="flex justify-center gap-2 mb-6">
                  {types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>

                {/* Genus */}
                {genus && (
                  <div className="text-center mb-6">
                    <p className="text-gray-400 font-mono italic">{genus}</p>
                  </div>
                )}

                {/* Flavor Text */}
                {flavorText && (
                  <div className="bg-[#1A2B3C] border-4 border-black p-4 mb-6">
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">{flavorText}</p>
                  </div>
                )}

                {/* Base Stats */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4 mb-6">
                  <h2 className="text-xl pokedex-font text-white mb-4">BASE STATS</h2>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                       <StatBar key={stat.stat.name} name={stat.stat.name} value={stat.base_stat} />
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4">
                  <h2 className="text-xl pokedex-font text-white mb-4">ABILITIES</h2>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.ability.name}
                        className="bg-[#233D4D] border-2 border-black px-3 py-2 font-mono text-sm text-white uppercase flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-yellow-400" />
                        {ability.ability.name.replace('-', ' ')}
                        {ability.is_hidden && <span className="text-gray-500 text-xs">(hidden)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
