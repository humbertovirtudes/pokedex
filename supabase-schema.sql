-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Caught Pokémon table
create table caught_pokemon (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  pokemon_id integer not null,
  caught_at timestamptz default now(),
  unique(user_id, pokemon_id)
);

-- Row Level Security
alter table caught_pokemon enable row level security;

-- Users can only see their own caught Pokémon
create policy "Users can view own caught Pokémon"
  on caught_pokemon for select
  using (auth.uid() = user_id);

-- Users can insert their own caught Pokémon
create policy "Users can insert own caught Pokémon"
  on caught_pokemon for insert
  with check (auth.uid() = user_id);

-- Users can delete their own caught Pokémon
create policy "Users can delete own caught Pokémon"
  on caught_pokemon for delete
  using (auth.uid() = user_id);

-- Index for fast lookups
create index idx_caught_pokemon_user_id on caught_pokemon(user_id);
create index idx_caught_pokemon_pokemon_id on caught_pokemon(pokemon_id);
