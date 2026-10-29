create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;
grant all on public.rate_limits to service_role;

create or replace function public.rate_limit_hit(_key text, _window_seconds integer, _max integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ws timestamptz := to_timestamp(floor(extract(epoch from now()) / _window_seconds) * _window_seconds);
  n integer;
begin
  insert into public.rate_limits (key, window_start, hits)
  values (_key, ws, 1)
  on conflict (key, window_start)
  do update set hits = public.rate_limits.hits + 1
  returning hits into n;

  -- ruim af en toe oude vensters op
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return n <= _max;
end;
$$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;