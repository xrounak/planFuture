-- Migration: Add nickname to profiles table
alter table public.profiles
add column if not exists nickname text;
