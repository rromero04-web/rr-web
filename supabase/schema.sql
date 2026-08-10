-- ============================================================================
-- Raúl Romero — Web & Growth
-- Esquema de Supabase: tabla de solicitudes de contacto
--
-- Cómo usarlo: abre el proyecto en supabase.com -> SQL Editor -> New query,
-- pega TODO este archivo tal cual y pulsa "Run". Es idempotente: puedes
-- volver a ejecutarlo sin duplicar nada ni romper datos existentes.
-- ============================================================================

-- 1. Tabla principal ----------------------------------------------------------

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  service text not null,
  budget text,
  message text not null,
  status text not null default 'new',
  source text not null default 'web',
  constraint contact_requests_service_check check (
    service in (
      'web-profesional',
      'web-de-captacion',
      'aplicaciones-a-medida',
      'no-lo-tengo-claro'
    )
  ),
  constraint contact_requests_status_check check (
    status in ('new', 'read', 'replied', 'archived')
  ),
  constraint contact_requests_email_format_check check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  constraint contact_requests_name_length_check check (char_length(name) between 1 and 200),
  constraint contact_requests_message_length_check check (char_length(message) between 1 and 4000)
);

comment on table public.contact_requests is
  'Solicitudes enviadas desde el formulario de contacto de raulromero.es.';

-- 2. Índices --------------------------------------------------------------

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

create index if not exists contact_requests_status_idx
  on public.contact_requests (status);

-- 3. Row Level Security -----------------------------------------------------

alter table public.contact_requests enable row level security;

-- Cualquier visitante (rol "anon", el que usa el formulario público) puede
-- INSERTAR una solicitud, pero nunca leer, modificar ni borrar filas.
drop policy if exists "contact_requests_public_insert" on public.contact_requests;
create policy "contact_requests_public_insert"
  on public.contact_requests
  for insert
  to anon
  with check (true);

-- Solo usuarios autenticados (por ejemplo, tú mismo desde el panel de
-- Supabase con tu usuario, o una futura zona de administración) pueden
-- leer las solicitudes.
drop policy if exists "contact_requests_authenticated_select" on public.contact_requests;
create policy "contact_requests_authenticated_select"
  on public.contact_requests
  for select
  to authenticated
  using (true);

-- Solo usuarios autenticados pueden actualizar el estado de una solicitud
-- (por ejemplo, marcarla como leída o respondida).
drop policy if exists "contact_requests_authenticated_update" on public.contact_requests;
create policy "contact_requests_authenticated_update"
  on public.contact_requests
  for update
  to authenticated
  using (true)
  with check (true);

-- No se define ninguna policy de DELETE a propósito: por defecto, con RLS
-- activado, nadie puede borrar filas salvo el rol "service_role" (que salta
-- RLS). Si más adelante quieres poder borrar solicitudes desde una zona de
-- administración autenticada, añade explícitamente una policy "for delete".
