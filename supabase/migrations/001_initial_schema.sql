-- Enable pgvector
create extension if not exists vector;

-- User voice profiles
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  niche text,
  target_audience text,
  tone text default 'conversational',
  sample_sentences text,
  newsletter_goal text default 'mix',
  send_day text default 'Tuesday',
  send_frequency text default 'weekly',
  from_name text,
  reply_to_email text,
  auto_draft_enabled boolean default true,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Knowledge files (metadata)
create table if not exists knowledge_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  source_type text not null check (source_type in ('upload', 'url', 'note')),
  source_url text,
  chunk_count int default 0,
  status text default 'processing' check (status in ('processing', 'ready', 'failed')),
  created_at timestamptz default now()
);

-- Knowledge chunks with vector embeddings
create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_id uuid references knowledge_files(id) on delete cascade not null,
  content text not null,
  embedding vector(512),
  chunk_index int not null,
  created_at timestamptz default now()
);

-- Vector similarity index
create index if not exists knowledge_chunks_embedding_idx
  on knowledge_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- Subscribers per user
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  first_name text,
  status text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  subscribed_at timestamptz default now(),
  unique(user_id, email)
);

-- Newsletters
create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  subject text,
  content text,
  content_text text,
  status text default 'draft' check (status in ('draft', 'approved', 'scheduled', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Newsletter analytics
create table if not exists newsletter_analytics (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid references newsletters(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  opens int default 0,
  clicks int default 0,
  unsubscribes int default 0,
  updated_at timestamptz default now()
);

-- Vector similarity search function
create or replace function match_knowledge_chunks(
  query_embedding vector(512),
  match_user_id uuid,
  match_count int default 15
)
returns table (
  id uuid,
  content text,
  file_id uuid,
  similarity float
)
language sql stable
as $$
  select
    kc.id,
    kc.content,
    kc.file_id,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  where kc.user_id = match_user_id
    and kc.embedding is not null
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

-- RLS policies (enable after development)
-- alter table user_profiles enable row level security;
-- alter table knowledge_files enable row level security;
-- alter table knowledge_chunks enable row level security;
-- alter table subscribers enable row level security;
-- alter table newsletters enable row level security;
-- alter table newsletter_analytics enable row level security;
