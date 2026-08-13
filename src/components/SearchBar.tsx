'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      // Don't touch offset — let the components handle pagination locally
      router.push(`/?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams]);

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="SEARCH POKéMON"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-[#1A2B3C] border-4 border-black text-white placeholder-gray-500 focus:outline-none font-mono text-sm uppercase tracking-wide"
      />
    </div>
  );
}
