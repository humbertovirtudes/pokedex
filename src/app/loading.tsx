export default function HomeLoading() {
  return (
    <div className="h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="pokedex-frame rounded-3xl p-6 w-full max-w-7xl h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative">
              <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-black overflow-hidden">
                <div className="w-full h-1/2 bg-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black" />
              </div>
            </div>
            <h1 className="text-4xl pokedex-font text-white tracking-wider">POKéDEX</h1>
          </div>
        </div>

        {/* LED Indicators + View Toggle */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500 led-glow animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-red-500 led-glow animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-green-500 led-glow animate-pulse" />
          </div>
          <div className="flex gap-1">
            <div className="w-10 h-8 bg-[#1E293B] animate-pulse" />
            <div className="w-10 h-8 bg-[#1E293B] animate-pulse" />
          </div>
        </div>

        {/* Screen Area */}
        <div className="screen-area rounded-xl flex-1 overflow-hidden flex flex-col relative">
          <div className="crt-effect">
            <div className="scroll-screen h-full">
              {/* Search bar skeleton */}
              <div className="sticky top-0 bg-[#233D4D] pb-2 z-20 px-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-10 bg-[#1E293B] animate-pulse" />
                  <div className="w-20 h-8 bg-[#1E293B] animate-pulse" />
                </div>
              </div>

              {/* Pokemon grid skeletons */}
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="relative">
                      <div className="bg-[#1E293B] border-4 border-black p-3">
                        <div className="aspect-square bg-[#1A2B3C] border-2 border-black flex items-center justify-center mb-3">
                          <div className="w-3/4 h-3/4 bg-[#233D4D] animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="h-4 w-24 bg-[#1A2B3C] animate-pulse" />
                            <div className="h-3 w-10 bg-[#1A2B3C] animate-pulse" />
                          </div>
                          <div className="flex gap-1">
                            <div className="h-6 w-14 bg-[#1A2B3C] animate-pulse" />
                            <div className="h-6 w-12 bg-[#1A2B3C] animate-pulse" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <div className="w-10 h-10 bg-[#1E293B] animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
