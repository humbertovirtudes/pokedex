'use client';

import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2 bg-[#1E293B] border-4 border-black p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 border-2 transition-colors ${
          view === 'grid'
            ? 'bg-[#233D4D] border-white'
            : 'border-transparent hover:bg-[#233D4D]'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 border-2 transition-colors ${
          view === 'list'
            ? 'bg-[#233D4D] border-white'
            : 'border-transparent hover:bg-[#233D4D]'
        }`}
        aria-label="List view"
      >
        <List className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
