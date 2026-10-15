-- Crea la tabla de compromisos y activa la seguridad por fila:
-- cada usuario solo puede ver y modificar sus propios compromisos.

create table if not exists public.commitments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  action          text not null check (char_length(action) >= 3),
  owner_name      text not null check (char_length(owner_name) >= 2),
  due_date        date,
  dependency      text,
  priority        text not null default 'media' check (priority in ('alta', 'media', 'baja')),
  source_sentence text not null default '',
  source_title    text not null default '',
  confidence      numeric not null default 1 check (confidence between 0 and 1),
  status          text not null default 'pendiente'
                  check (status in ('pendiente', 'en_progreso', 'bloqueado', 'completado', 'cancelado')),
  evidence        text,
  history         jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists commitments_user_due_idx on public.commitments (user_id, due_date);

alter table public.commitments enable row level security;

create policy "Leer mis compromisos"
  on public.commitments for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Crear mis compromisos"
  on public.commitments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Editar mis compromisos"
  on public.commitments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Borrar mis compromisos"
  on public.commitments for delete
  to authenticated
  using (auth.uid() = user_id);
