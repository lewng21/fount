import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { runNewsletterPipeline } from '@/lib/agents/pipeline'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.niche) {
    return NextResponse.json({ error: 'Complete your profile in Settings first' }, { status: 400 })
  }

  const { count } = await supabase
    .from('knowledge_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (!count || count === 0) {
    return NextResponse.json({ error: 'Add content to your Brain first' }, { status: 400 })
  }

  const { draft, agentTrace } = await runNewsletterPipeline(user.id, profile)

  const { data: newsletter, error } = await admin
    .from('newsletters')
    .insert({
      user_id: user.id,
      subject: draft.subject,
      content: draft.content,
      content_text: draft.contentText,
      status: 'draft',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id: newsletter.id,
    subject: newsletter.subject,
    agentTrace,
  })
}
