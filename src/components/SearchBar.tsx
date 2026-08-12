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
        params.set('offset', '0');
      } else {
        params.delete('search');
        params.set('offset', '0');
      }
      router.push(`/?${params.toString()}`);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query, router, searchParams]);
  
  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-700 transition-all"
      />
    </div>
  );
}
