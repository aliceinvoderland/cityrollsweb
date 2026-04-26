create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text unique,
  approved_purchases integer not null default 0 check (approved_purchases >= 0),
  total_uploads integer not null default 0 check (total_uploads >= 0),
  reward_unlocked boolean not null default false,
  reward_redeemed boolean not null default false,
  created_at timestamptz not null default now(),
  reward_unlocked_at timestamptz,
  reward_redeemed_at timestamptz
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  user_email text,
  user_name text,
  file_url text not null,
  file_path text not null,
  amount numeric(10, 2),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  user_name text,
  user_email text,
  code text not null unique,
  redeemed boolean not null default false,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz,
  redeemed_by text
);

create index if not exists uploads_user_id_created_at_idx on public.uploads (user_id, created_at desc);
create index if not exists uploads_status_created_at_idx on public.uploads (status, created_at desc);
create index if not exists rewards_created_at_idx on public.rewards (created_at desc);

create or replace function public.increment_total_uploads()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set total_uploads = total_uploads + 1
  where id = new.user_id;

  return new;
end;
$$;

drop trigger if exists uploads_increment_total_uploads on public.uploads;
create trigger uploads_increment_total_uploads
after insert on public.uploads
for each row execute function public.increment_total_uploads();

alter table public.users enable row level security;
alter table public.uploads enable row level security;
alter table public.rewards enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
on public.users
for insert
to authenticated
with check (
  auth.uid() = id
  and coalesce(approved_purchases, 0) = 0
  and coalesce(total_uploads, 0) = 0
  and coalesce(reward_unlocked, false) = false
  and coalesce(reward_redeemed, false) = false
);

drop policy if exists "uploads_select_own" on public.uploads;
create policy "uploads_select_own"
on public.uploads
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "uploads_insert_own" on public.uploads;
create policy "uploads_insert_own"
on public.uploads
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and reviewed_at is null
  and reviewed_by is null
  and split_part(file_path, '/', 1) = auth.uid()::text
);

drop policy if exists "rewards_select_own" on public.rewards;
create policy "rewards_select_own"
on public.rewards
for select
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bills',
  'bills',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "storage_public_read_bills" on storage.objects;
create policy "storage_public_read_bills"
on storage.objects
for select
to public
using (bucket_id = 'bills');

drop policy if exists "storage_insert_own_bills" on storage.objects;
create policy "storage_insert_own_bills"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'bills'
  and (storage.foldername(name))[1] = auth.uid()::text
);

notify pgrst, 'reload schema';
