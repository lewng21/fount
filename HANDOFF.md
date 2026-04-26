# Fount — Session Handoff

## Where We Are (as of 2026-04-25)

Build passes clean. DB is live. Multi-agent pipeline is built. All dashboard pages are wired to real data. App is ready to deploy — just needs a domain, API keys, and Vercel setup.

---

## What's Done

### Session 1 (original scaffold)
- Full Next.js 16 app scaffolded with Tailwind + TypeScript
- Brand colors applied (#114B5F teal, #1A936F emerald, #C46D5E terracotta, #F3E9D2 cream)
- Supabase project created (Fount — lewng21's Org)
- DB migration run successfully — all 6 tables + pgvector + match_knowledge_chunks RPC live
- Full RAG pipeline built: chunker → Voyage AI embeddings → pgvector → Claude draft
- File parsers: PDF (pdf-parse), DOCX (mammoth), Markdown, URL (cheerio)
- All API routes built and compiling
- Dashboard pages: brain vault, newsletters list, newsletter editor (Tiptap), subscribers, settings, onboarding
- Auth: Supabase SSR set up, auth wall DISABLED in proxy.ts for dev
- Public pages: homepage, /how-it-works (interactive brain demo)
- Committed to GitHub: lewng21/fount (main branch)

### Session 2 (2026-04-25) — Multi-Agent Architecture + Page Wiring

#### Multi-Agent Newsletter Pipeline (`lib/agents/`)
The old generate flow was a single RAG query → single Claude call. It's been replaced with a 3-agent pipeline:

1. **Research Agent** (`lib/agents/research-agent.ts`)
   - Claude equipped with a `search_knowledge_base` tool
   - Runs an autonomous agentic loop: Claude decides what to search for and calls the tool 3-5 times with different query angles
   - Each tool call hits the pgvector RAG → returns top-8 chunks → Claude synthesizes findings
   - Loop exits when Claude stops using tools and writes a RESEARCH SUMMARY
   - This is the "trained AI agent" architecture — Claude controls the research strategy, not us

2. **Writer Agent** (`lib/agents/writer-agent.ts`)
   - Takes the research summary + user's voice profile
   - Single Claude call with system prompt caching (`cache_control: ephemeral`) on the voice profile context
   - Outputs structured draft: `SUBJECT: ...` / `---` / body

3. **Editor Agent** (`lib/agents/editor-agent.ts`)
   - Skipped entirely if user hasn't set `sample_sentences` in their profile
   - When present: Claude reviews the draft against the user's own writing examples and fixes AI-isms
   - System prompt cached

4. **Pipeline** (`lib/agents/pipeline.ts`)
   - Orchestrates Research → Write → Edit in sequence
   - Returns `{ draft, agentTrace: { queriesRun, chunksFound } }` — trace returned in API response for transparency

`app/api/newsletters/generate/route.ts` updated to use the pipeline.

#### Pages Wired to Real Data (were all hardcoded stubs before)

- **Dashboard** (`app/(dashboard)/dashboard/page.tsx`) — server component, now runs 4 parallel Supabase queries: active subscriber count, sent newsletter count, brain file count, recent 5 newsletters. Contextual "Set up Brain" prompt disappears once files are uploaded.

- **Newsletters** (`app/(dashboard)/newsletters/page.tsx`) — converted to client component, fetches from `/api/newsletters` (new route), Generate Draft button calls the pipeline and navigates directly to the new draft in the editor. Shows progress banner during generation (~30s).

- **Subscribers** (`app/(dashboard)/subscribers/page.tsx`) — fetches real list on load, Add form POSTs to `/api/subscribers` and refreshes the list.

- **Settings** (`app/(dashboard)/settings/page.tsx`) — loads saved profile from `/api/settings` on mount, saves with a green checkmark confirmation state.

- **Onboarding** (`app/onboarding/page.tsx`) — POSTs to `/api/onboarding` (new route) which saves profile and sets `onboarding_complete: true`.

#### New API Routes
- `app/api/newsletters/route.ts` — GET: lists user's newsletters ordered by date
- `app/api/onboarding/route.ts` — POST: upserts user profile + sets `onboarding_complete: true`

---

## What's Blocked / Still Needed

### 1. Domain (not yet purchased)
- fount.ai is taken (GoDaddy selling it)
- Names considered: Quilln, Quillr, Scrivly, Inkly, Sendero, Draftly, Voiced
- No final decision made — user still deciding
- Check Namecheap for availability of .com / .app / .co

### 2. API Keys (not yet added to .env.local)
Open `C:\Users\lewng\Desktop\fount\.env.local` and add:
```
ANTHROPIC_API_KEY=sk-ant-...       # console.anthropic.com
VOYAGE_API_KEY=pa-...              # dash.voyageai.com
RESEND_API_KEY=re_...              # resend.com
CRON_SECRET=any-string-you-choose
```
Supabase keys are already in .env.local.

### 3. Vercel Deploy (not yet set up)
- Go to vercel.com → New Project → Import from GitHub (lewng21/fount)
- Add all env vars from .env.local during setup
- After deploy: Project Settings → Domains → add your domain
- Point Namecheap DNS to Vercel (A record + CNAME)

### 4. Before Launch
- Re-enable auth wall in proxy.ts (currently disabled for dev browsing)
- Enable RLS on all Supabase tables (commented out in migration)
- Rotate Supabase service role key (was shared in an earlier chat session)
- Set up Vercel cron (vercel.json) for weekly auto-draft generation
- Configure Resend sending domain (currently placeholder hello@fount.app)

---

## Key Files to Know

### Agent Pipeline
- `lib/agents/research-agent.ts` — Claude tool-use loop, autonomous RAG research
- `lib/agents/writer-agent.ts` — draft generation with voice profile + prompt caching
- `lib/agents/editor-agent.ts` — voice refinement pass (skipped if no sample_sentences)
- `lib/agents/pipeline.ts` — orchestrates Research → Write → Edit

### App
- `proxy.ts` — Next.js 16 middleware (auth wall disabled, re-enable before launch)
- `lib/rag.ts` — pgvector similarity search via Supabase RPC (`retrieveRelevantChunks`)
- `lib/chunker.ts` — 1800 char chunks, 200 overlap, sentence boundary detection
- `lib/embeddings.ts` — Voyage AI embeddings via createRequire (CJS workaround)
- `supabase/migrations/001_initial_schema.sql` — already run, do not run again
- `app/(dashboard)/brain/page.tsx` — brain vault UI, fully wired to API
- `app/(dashboard)/newsletters/[id]/page.tsx` — Tiptap newsletter editor
- `next.config.ts` — serverExternalPackages for CJS compat

---

## Tech Stack
- Next.js 16.2.4 (App Router, Turbopack)
- Supabase (Postgres + pgvector, 512-dim vectors)
- Voyage AI (voyage-3-lite) for embeddings
- Claude API (claude-sonnet-4-6) for the full agent pipeline
- Resend for email delivery
- Vercel for hosting + cron

---

## Product Context
Fount is a standalone SaaS (separate from GearBook) that manages newsletters autonomously using AI. Users upload their notes, past writing, and content (their "second brain"), Fount learns their voice via a multi-agent pipeline, then drafts and sends newsletters that sound like them. Target users: creators, writers, solopreneurs. GearBook guides are the first beta users.
