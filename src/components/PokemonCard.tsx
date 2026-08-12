import Link from 'next/link';
import { TypeBadge } from './TypeBadge';

interface PokemonCardProps {
  name: string;
  id: number;
  image: string;
  types: string[];
}

export function PokemonCard({ name, id, image, types }: PokemonCardProps) {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  return (
    <Link href={`/pokemon/${name}`}>
      <div className="group relative bg-gray-900 rounded-2xl border border-gray-800 p-4 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/50">
        <div className="aspect-square bg-gray-950 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white capitalize">
              {capitalizedName}
            </h3>
            <span className="text-sm text-gray-500 font-mono">#{id.toString().padStart(3, '0')}</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {types.map((type) => (
              <TypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
