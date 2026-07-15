create extension if not exists vector;

create table if not exists public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('course','rating')),
  source_id uuid not null,
  course_slug text,
  course_name text,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

grant select on public.rag_chunks to anon, authenticated;
grant all on public.rag_chunks to service_role;

alter table public.rag_chunks enable row level security;

create policy "rag_chunks readable by everyone"
  on public.rag_chunks for select
  using (true);

create index if not exists rag_chunks_embedding_idx
  on public.rag_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists rag_chunks_source_idx
  on public.rag_chunks (source_type, source_id);

create or replace function public.match_rag_chunks(
  query_embedding vector(1536),
  match_count int default 8
)
returns table (
  id uuid,
  source_type text,
  source_id uuid,
  course_slug text,
  course_name text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
set search_path = public
as $$
  select
    c.id, c.source_type, c.source_id, c.course_slug, c.course_name,
    c.content, c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.rag_chunks c
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_rag_chunks(vector, int) to anon, authenticated;