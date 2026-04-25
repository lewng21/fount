import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { chunkText } from '@/lib/chunker'
import { embedTexts } from '@/lib/embeddings'
import { parseUrl } from '@/lib/parsers/url'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

  let parsed: { text: string; title: string }
  try {
    parsed = await parseUrl(url)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 422 })
  }

  const { data: fileRow, error: fileErr } = await admin
    .from('knowledge_files')
    .insert({ user_id: user.id, filename: parsed.title, source_type: 'url', source_url: url, status: 'processing' })
    .select()
    .single()

  if (fileErr || !fileRow) return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })

  const chunks = chunkText(parsed.text)

  try {
    const embeddings = await embedTexts(chunks)
    const rows = chunks.map((content, i) => ({
      user_id: user.id,
      file_id: fileRow.id,
      content,
      embedding: JSON.stringify(embeddings[i]),
      chunk_index: i,
    }))

    await admin.from('knowledge_chunks').insert(rows)
    await admin.from('knowledge_files').update({ status: 'ready', chunk_count: chunks.length }).eq('id', fileRow.id)
  } catch {
    await admin.from('knowledge_files').update({ status: 'failed' }).eq('id', fileRow.id)
    return NextResponse.json({ error: 'Embedding failed' }, { status: 500 })
  }

  return NextResponse.json({ id: fileRow.id, filename: parsed.title, chunk_count: chunks.length })
}
