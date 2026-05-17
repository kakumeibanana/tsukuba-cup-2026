-- TSUKUBA CUP 2026 — Supabase schema
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行

-- 試合
create table if not exists matches (
  id           uuid primary key default gen_random_uuid(),
  gender       text not null check (gender in ('男子', '女子')),
  stage        text not null check (stage in ('league', 'tournament')),
  group_name   text,
  round        text,
  match_date   text not null,
  match_dow    text not null,
  home_name    text not null,
  away_name    text not null,
  home_scorers text[]  default '{}',
  away_scorers text[]  default '{}',
  score_home   int,
  score_away   int,
  status       text not null default 'scheduled'
               check (status in ('scheduled', 'live', 'finished', 'cancelled')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- チーム
create table if not exists teams (
  id          serial primary key,
  name        text not null unique,
  gender      text not null check (gender in ('男子', '女子')),
  group_name  text,
  color       text not null default '#7c3aed',
  description text default '',
  sort_order  int  default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- メンバー
create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  team_id    int references teams(id) on delete cascade,
  name       text not null,
  role       text default '',
  sort_order int  default 0
);

-- お知らせ
create table if not exists news (
  id          uuid primary key default gen_random_uuid(),
  category    text not null default 'お知らせ',
  title       text not null,
  body        text default '',
  news_date   text not null,
  bg_gradient text default 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- RLS 有効化
alter table matches enable row level security;
alter table teams   enable row level security;
alter table members enable row level security;
alter table news    enable row level security;

-- 公開ユーザー：読み取りのみ
create policy "public_read_matches" on matches for select using (true);
create policy "public_read_teams"   on teams   for select using (true);
create policy "public_read_members" on members for select using (true);
create policy "public_read_news"    on news    for select using (published = true);

-- 管理者（@sgh-tsukuba.org）：全操作
create policy "admin_all_matches" on matches for all
  using      ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org')
  with check ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org');

create policy "admin_all_teams" on teams for all
  using      ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org')
  with check ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org');

create policy "admin_all_members" on members for all
  using      ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org')
  with check ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org');

create policy "admin_all_news" on news for all
  using      ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org')
  with check ((auth.jwt() ->> 'email') like '%@sgh-tsukuba.org');
