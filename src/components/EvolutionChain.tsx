'use client';

import Image from 'next/image';
import { ArrowRight, Flame, Gem, Link2, Heart, Sun, Moon, CloudRain, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EvolutionStep {
  name: string;
  id: number;
  condition?: string;
}

interface EvolutionChainProps {
  chain: EvolutionStep[];
  currentId: number;
}

function getConditionIcon(condition: string) {
  const lower = condition.toLowerCase();
  if (lower.startsWith('lv.')) return <Flame className="w-3 h-3" />;
  if (lower.includes('trade')) return <Link2 className="w-3 h-3" />;
  if (lower.includes('use ') || lower.includes('stone')) return <Gem className="w-3 h-3" />;
  if (lower.includes('friendship') || lower.includes('affection')) return <Heart className="w-3 h-3" />;
  if (lower.includes('night')) return <Moon className="w-3 h-3" />;
  if (lower.includes('day')) return <Sun className="w-3 h-3" />;
  if (lower.includes('rain')) return <CloudRain className="w-3 h-3" />;
  if (lower.includes('at ') || lower.includes('level at')) return <MapPin className="w-3 h-3" />;
  return <Sparkles className="w-3 h-3" />;
}

function getConditionColor(condition: string) {
  const lower = condition.toLowerCase();
  if (lower.startsWith('lv.')) return 'text-orange-400';
  if (lower.includes('trade')) return 'text-purple-400';
  if (lower.includes('stone') || lower.includes('use ')) return 'text-pink-400';
  if (lower.includes('friendship') || lower.includes('affection')) return 'text-red-400';
  return 'text-yellow-400';
}

export function EvolutionChain({ chain, currentId }: EvolutionChainProps) {
  if (!chain || chain.length === 0) {
    return null;
  }

  if (chain.length === 1) {
    return null;
  }

  return (
    <div className="bg-[#1A2B3C] border-4 border-black p-4 mb-6">
      <h2 className="text-xl pokedex-font text-white mb-4">EVOLUTION LINE</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {chain.map((step, index) => {
          const isCurrent = step.id === currentId;
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${step.id}.png`;

          return (
            <div key={step.id} className="flex items-center gap-2">
              {/* Evolution step */}
              <Link href={`/pokemon/${step.name}`}>
                <div className={`
                  flex flex-col items-center gap-1 p-2 border-2 transition-colors
                  ${isCurrent
                    ? 'border-yellow-400 bg-[#233D4D]'
                    : 'border-black hover:border-gray-600'
                  }
                `}>
                  <div className="relative w-12 h-12">
                    <Image
                      src={spriteUrl}
                      alt={step.name}
                      width={48}
                      height={48}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className={`
                    text-xs font-mono uppercase
                    ${isCurrent ? 'text-yellow-400' : 'text-gray-400'}
                  `}>
                    {step.name}
                  </span>
                  {index === 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Flame className="w-3 h-3" />
                      Lv.1
                    </div>
                  )}
                  {step.condition && index > 0 && (
                    <div className={`flex items-center gap-1 text-xs ${getConditionColor(step.condition)}`}>
                      {getConditionIcon(step.condition)}
                      {step.condition}
                    </div>
                  )}
                </div>
              </Link>

              {/* Arrow to next */}
              {index < chain.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
