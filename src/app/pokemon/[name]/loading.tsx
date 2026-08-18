import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PokemonDetailLoading() {
  return (
    <div className="h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="pokedex-frame rounded-3xl p-6 w-full max-w-7xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <Link href="/">
            <div className="flex items-center gap-2 bg-[#1E293B] border-4 border-black px-4 py-2">
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white font-mono">BACK</span>
            </div>
          </Link>
        </div>

        {/* LED Indicators */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="w-4 h-4 rounded-full bg-blue-500 led-glow animate-pulse" />
          <div className="w-4 h-4 rounded-full bg-red-500 led-glow animate-pulse" />
          <div className="w-4 h-4 rounded-full bg-green-500 led-glow animate-pulse" />
        </div>

        {/* Screen Area */}
        <div className="screen-area rounded-xl flex-1 overflow-hidden flex flex-col relative">
          <div className="crt-effect">
            <div className="scroll-screen h-full">
              <div className="px-4 pt-4 pb-4 space-y-6">
                {/* Name + ID skeleton */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-8 w-40 bg-[#1E293B] animate-pulse mb-2" />
                    <div className="h-4 w-12 bg-[#1E293B] animate-pulse" />
                  </div>
                  <div className="w-10 h-10 bg-[#1E293B] animate-pulse" />
                </div>

                {/* Image skeleton */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-[#1E293B] animate-pulse" />
                </div>

                {/* Types skeleton */}
                <div className="flex justify-center gap-2">
                  <div className="h-7 w-20 bg-[#1E293B] animate-pulse" />
                  <div className="h-7 w-16 bg-[#1E293B] animate-pulse" />
                </div>

                {/* Genus skeleton */}
                <div className="text-center">
                  <div className="h-4 w-32 mx-auto bg-[#1E293B] animate-pulse" />
                </div>

                {/* Evolution chain skeleton */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4">
                  <div className="h-6 w-32 bg-[#1E293B] animate-pulse mb-4" />
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-20 bg-[#1E293B] animate-pulse" />
                    <div className="w-4 h-4 bg-[#1E293B] animate-pulse" />
                    <div className="w-16 h-20 bg-[#1E293B] animate-pulse" />
                    <div className="w-4 h-4 bg-[#1E293B] animate-pulse" />
                    <div className="w-16 h-20 bg-[#1E293B] animate-pulse" />
                  </div>
                </div>

                {/* Flavor text skeleton */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#1E293B] animate-pulse" />
                    <div className="h-4 w-4/5 bg-[#1E293B] animate-pulse" />
                    <div className="h-4 w-3/4 bg-[#1E293B] animate-pulse" />
                  </div>
                </div>

                {/* Stats skeleton */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4">
                  <div className="h-6 w-28 bg-[#1E293B] animate-pulse mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-[#1E293B] animate-pulse" />
                        <div className="h-4 flex-1 bg-[#1E293B] animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities skeleton */}
                <div className="bg-[#1A2B3C] border-4 border-black p-4">
                  <div className="h-6 w-28 bg-[#1E293B] animate-pulse mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-9 w-24 bg-[#1E293B] animate-pulse" />
                    <div className="h-9 w-20 bg-[#1E293B] animate-pulse" />
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
