import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { chunkText } from '@/lib/chunker'
import { embedTexts } from '@/lib/embeddings'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, title } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'No content provided' }, { status: 400 })

  const filename = title?.trim() || `Note — ${new Date().toLocaleDateString()}`

  const { data: fileRow, error: fileErr } = await admin
    .from('knowledge_files')
    .insert({ user_id: user.id, filename, source_type: 'note', status: 'processing' })
    .select()
    .single()

  if (fileErr || !fileRow) return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })

  const chunks = chunkText(content)
  if (chunks.length === 0) chunks.push(content.trim())

  try {
    const embeddings = await embedTexts(chunks)
    const rows = chunks.map((c, i) => ({
      user_id: user.id,
      file_id: fileRow.id,
      content: c,
      embedding: JSON.stringify(embeddings[i]),
      chunk_index: i,
    }))

    await admin.from('knowledge_chunks').insert(rows)
    await admin.from('knowledge_files').update({ status: 'ready', chunk_count: chunks.length }).eq('id', fileRow.id)
  } catch {
    await admin.from('knowledge_files').update({ status: 'failed' }).eq('id', fileRow.id)
    return NextResponse.json({ error: 'Embedding failed' }, { status: 500 })
  }

  return NextResponse.json({ id: fileRow.id, filename, chunk_count: chunks.length })
}
