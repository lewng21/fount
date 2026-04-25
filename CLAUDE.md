# Fount — AI Newsletter Agent

## What is Fount
Fount is a standalone SaaS product (separate from GearBook) that manages newsletters autonomously using AI. Users upload their notes, past writing, and content (their "second brain"), and Fount learns their voice to draft, schedule, and send newsletters that sound like them.

## Stack
- Next.js 16.2.4 (App Router, Turbopack) + TypeScript + Tailwind CSS
- Supabase (Postgres + pgvector for embeddings)
- Claude API (claude-sonnet-4-6) for newsletter drafts
- Voyage AI (voyage-3-lite, 512-dim) for text embeddings
- Resend for email delivery
- Vercel for hosting + cron jobs

## Key Architecture Notes
- **Next.js 16**: middleware is now `proxy.ts` (not `middleware.ts`). Export function as `proxy`, not `middleware`.
- **pgvector**: uses `match_knowledge_chunks` RPC function for similarity search
- **RAG pipeline**: upload → parse → chunk (lib/chunker.ts) → embed (Voyage AI) → store in knowledge_chunks → retrieve via vector search → Claude generates draft
- **Auth**: Supabase Auth. Server client in `lib/supabase/server.ts`, browser client in `lib/supabase/client.ts`
- **Admin operations**: use service role client (createAdmin) for writes that bypass RLS
- **Auth wall**: currently disabled in proxy.ts for development — re-enable before launch

## Brand Colors
- Background: #F3E9D2 (cream)
- Sidebar: #114B5F (deep teal)
- Accent/primary: #1A936F (emerald)
- Secondary accent: #C46D5E (terracotta)
- Sage: #C6DABF
- All colors in CSS vars: `var(--fount-*)` defined in app/globals.css

## File Structure
```
app/
  (auth)/login, signup        — public auth pages
  (dashboard)/                — sidebar layout, all require auth in prod
    dashboard/                — overview stats
    brain/                    — knowledge vault UI
    newsletters/              — list + [id] editor
    subscribers/              — subscriber management
    settings/                 — voice profile + schedule config
  onboarding/                 — 3-step setup (niche → voice → schedule)
  page.tsx                    — public homepage
  how-it-works/               — brain demo/preview page
  api/
    brain/upload, url, note, files, [id]
    newsletters/generate, [id], [id]/send
    settings/
    subscribers/, subscribers/unsubscribe
    cron/generate-drafts, send-scheduled
lib/
  supabase/client.ts, server.ts
  chunker.ts                  — text splitting (1800 char chunks, 200 overlap)
  embeddings.ts               — Voyage AI batch embedding
  rag.ts                      — pgvector similarity search via Supabase RPC
  claude.ts                   — newsletter draft generation with Claude API
  parsers/pdf.ts, docx.ts, markdown.ts, url.ts
components/
  Sidebar.tsx                 — dark teal sidebar nav
supabase/
  migrations/001_initial_schema.sql — run in Supabase SQL editor
```

## DB Tables
- `user_profiles` — voice profile, schedule preferences
- `knowledge_files` — metadata for uploaded files/URLs/notes
- `knowledge_chunks` — chunked text + 512-dim vector embeddings
- `subscribers` — per-user subscriber list
- `newsletters` — drafts, approved, sent newsletters
- `newsletter_analytics` — opens, clicks, unsubscribes

## Important Notes
- npm only (never yarn or pnpm)
- Never use `git add .` — stage specific files
- Run `npm run build` before pushing to verify
- Supabase project: Fount (lewng21's Org)
- GitHub: lewng21/fount
- RLS is currently commented out in migrations — enable before launch
- CRON_SECRET env var required for cron routes
- Resend sending domain not yet configured (use placeholder from@fount.app)
