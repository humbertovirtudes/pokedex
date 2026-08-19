'use server';

import { eq, and } from 'drizzle-orm';
import { db } from '@/db/db';
import { caughtPokemon } from '@/db/schema';
import { createServerClient } from '@/lib/supabase/server';

async function getUser() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCaughtPokemonIds(): Promise<number[]> {
  const user = await getUser();
  if (!user) return [];

  try {
    const rows = await db
      .select({ pokemonId: caughtPokemon.pokemonId })
      .from(caughtPokemon)
      .where(eq(caughtPokemon.userId, user.id));

    return rows.map(r => r.pokemonId);
  } catch {
    return [];
  }
}

export async function toggleCaught(pokemonId: number) {
  const user = await getUser();
  if (!user) return;

  try {
    const existing = await db
      .select()
      .from(caughtPokemon)
      .where(and(
        eq(caughtPokemon.userId, user.id),
        eq(caughtPokemon.pokemonId, pokemonId)
      ))
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(caughtPokemon)
        .where(and(
          eq(caughtPokemon.userId, user.id),
          eq(caughtPokemon.pokemonId, pokemonId)
        ));
    } else {
      await db
        .insert(caughtPokemon)
        .values({ userId: user.id, pokemonId });
    }
  } catch (err) {
    console.error('Failed to toggle caught:', err);
  }
}
