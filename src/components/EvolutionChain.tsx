'use client';

import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';

interface EvolutionStep {
  name: string;
  id: number;
  min_level?: number;
}

interface EvolutionChainProps {
  chain: EvolutionStep[];
  currentId: number;
}

export function EvolutionChain({ chain, currentId }: EvolutionChainProps) {
  if (!chain || chain.length === 0) {
    return null;
  }

  // Only show if there's more than one stage
  if (chain.length === 1) {
    return null;
  }

  return (
    <div className="bg-[#1A2B3C] border-4 border-black p-4">
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
                  {step.min_level && index > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Flame className="w-3 h-3" />
                      Lv.{step.min_level}
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
