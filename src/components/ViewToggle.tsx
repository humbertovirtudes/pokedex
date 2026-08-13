'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Grid3X3, List } from 'lucide-react';

export function ViewToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get('view') || 'grid';
  
  const toggleView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.push(`/?${params.toString()}`);
  };
  
  return (
    <div className="flex items-center gap-2 bg-[#1A2B3C] border-4 border-black p-2">
      <button
        onClick={() => toggleView('grid')}
        className={`p-2 border-2 border-black transition-colors ${
          view === 'grid' || view === ''
            ? 'bg-[#DC0A2D] text-white'
            : 'bg-[#1E293B] text-gray-400 hover:text-white'
        }`}
        aria-label="Grid view"
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => toggleView('list')}
        className={`p-2 border-2 border-black transition-colors ${
          view === 'list'
            ? 'bg-[#DC0A2D] text-white'
            : 'bg-[#1E293B] text-gray-400 hover:text-white'
        }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
