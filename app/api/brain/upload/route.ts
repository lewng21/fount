import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { chunkText } from '@/lib/chunker'
import { embedTexts } from '@/lib/embeddings'
import { parsePdf } from '@/lib/parsers/pdf'
import { parseDocx } from '@/lib/parsers/docx'
import { parseMarkdown } from '@/lib/parsers/markdown'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  let rawText = ''
  try {
    if (ext === 'pdf') rawText = await parsePdf(buffer)
    else if (ext === 'docx') rawText = await parseDocx(buffer)
    else rawText = parseMarkdown(buffer.toString('utf-8'))
  } catch {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 422 })
  }

  const { data: fileRow, error: fileErr } = await admin
    .from('knowledge_files')
    .insert({ user_id: user.id, filename: file.name, source_type: 'upload', status: 'processing' })
    .select()
    .single()

  if (fileErr || !fileRow) return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })

  const chunks = chunkText(rawText)

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

  return NextResponse.json({ id: fileRow.id, filename: file.name, chunk_count: chunks.length })
}
