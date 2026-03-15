-- VimSkillHub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null
);

-- Skills table
create table skills (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  long_description text,
  category text not null default 'other',
  tags text[] default '{}',
  github_url text,
  file_url text,
  file_name text,
  version text default '1.0.0',
  stars_count integer default 0,
  downloads_count integer default 0,
  avg_rating numeric(3,2) default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Comments table
create table comments (
  id uuid default uuid_generate_v4() primary key,
  skill_id uuid references skills(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Ratings table
create table ratings (
  id uuid default uuid_generate_v4() primary key,
  skill_id uuid references skills(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  score integer not null check (score >= 1 and score <= 5),
  created_at timestamptz default now() not null,
  unique(skill_id, user_id)
);

-- Stars table (favorites/likes)
create table stars (
  id uuid default uuid_generate_v4() primary key,
  skill_id uuid references skills(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(skill_id, user_id)
);

-- Downloads tracking table
create table downloads (
  id uuid default uuid_generate_v4() primary key,
  skill_id uuid references skills(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null,
  downloaded_at timestamptz default now() not null
);

-- Indexes
create index idx_skills_author on skills(author_id);
create index idx_skills_category on skills(category);
create index idx_skills_stars on skills(stars_count desc);
create index idx_skills_downloads on skills(downloads_count desc);
create index idx_comments_skill on comments(skill_id);
create index idx_ratings_skill on ratings(skill_id);
create index idx_stars_skill on stars(skill_id);
create index idx_stars_user on stars(user_id);
create index idx_downloads_skill on downloads(skill_id);

-- Full text search index on skills
create index idx_skills_search on skills using gin(to_tsvector('english', title || ' ' || description));

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger skills_updated_at
  before update on skills
  for each row execute function update_updated_at();

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table skills enable row level security;
alter table comments enable row level security;
alter table ratings enable row level security;
alter table stars enable row level security;
alter table downloads enable row level security;

-- Profiles: anyone can read, users can update own
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Skills: anyone can read, authenticated users can insert, authors can update/delete
create policy "Skills are viewable by everyone" on skills
  for select using (true);
create policy "Authenticated users can create skills" on skills
  for insert with check (auth.uid() = author_id);
create policy "Authors can update own skills" on skills
  for update using (auth.uid() = author_id);
create policy "Authors can delete own skills" on skills
  for delete using (auth.uid() = author_id);

-- Comments: anyone can read, authenticated users can insert, authors can delete
create policy "Comments are viewable by everyone" on comments
  for select using (true);
create policy "Authenticated users can comment" on comments
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on comments
  for delete using (auth.uid() = user_id);

-- Ratings: anyone can read, authenticated users can insert/update own
create policy "Ratings are viewable by everyone" on ratings
  for select using (true);
create policy "Authenticated users can rate" on ratings
  for insert with check (auth.uid() = user_id);
create policy "Users can update own rating" on ratings
  for update using (auth.uid() = user_id);

-- Stars: anyone can read, authenticated users can insert/delete own
create policy "Stars are viewable by everyone" on stars
  for select using (true);
create policy "Authenticated users can star" on stars
  for insert with check (auth.uid() = user_id);
create policy "Users can unstar" on stars
  for delete using (auth.uid() = user_id);

-- Downloads: anyone can read/insert
create policy "Downloads are viewable by everyone" on downloads
  for select using (true);
create policy "Anyone can track downloads" on downloads
  for insert with check (true);

-- Storage bucket for skill files
insert into storage.buckets (id, name, public) values ('skill-files', 'skill-files', true);

create policy "Anyone can read skill files" on storage.objects
  for select using (bucket_id = 'skill-files');
create policy "Authenticated users can upload skill files" on storage.objects
  for insert with check (bucket_id = 'skill-files' and auth.role() = 'authenticated');
