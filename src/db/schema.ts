import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';

export const caughtPokemon = pgTable('caught_pokemon', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  pokemonId: integer('pokemon_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
