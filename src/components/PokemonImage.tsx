'use client';

import { useState } from 'react';

interface PokemonImageProps {
  pokemonId: number;
  pokemonName: string;
  className?: string;
}

export function PokemonImage({ pokemonId, pokemonName, className }: PokemonImageProps) {
  const primaryImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  const [imgSrc, setImgSrc] = useState(primaryImage);

  return (
    <img
      src={imgSrc}
      alt={pokemonName}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackImage) {
          setImgSrc(fallbackImage);
        }
      }}
    />
  );
}
