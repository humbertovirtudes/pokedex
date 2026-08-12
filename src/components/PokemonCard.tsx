import Link from 'next/link';
import { useState } from 'react';
import { TypeBadge } from './TypeBadge';

interface PokemonCardProps {
  name: string;
  id: number;
  image: string;
  types: string[];
}

export function PokemonCard({ name, id, image, types }: PokemonCardProps) {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  // Use ID-based sprite URL as primary (more reliable than PokeAPI redirect)
  const primaryImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const [imgSrc, setImgSrc] = useState(primaryImage);
  
  const handleImageError = () => {
    if (imgSrc !== fallbackImage) {
      setImgSrc(fallbackImage);
    }
  };
  
  return (
    <Link href={`/pokemon/${name}`}>
      <div className="group relative bg-[#1E293B] border-4 border-black p-3 hover:bg-[#233D4D] transition-all duration-300">
        <div className="aspect-square bg-[#1A2B3C] border-2 border-black flex items-center justify-center mb-3 overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-white uppercase">
              {capitalizedName}
            </h3>
            <span className="text-xs text-gray-400 font-mono">#{id.toString().padStart(3, '0')}</span>
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
