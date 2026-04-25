import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { retrieveRelevantChunks } from '@/lib/rag'
import { generateNewsletterDraft } from '@/lib/claude'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Load voice profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.niche) {
    return NextResponse.json({ error: 'Complete your profile in Settings first' }, { status: 400 })
  }

  // Check brain has content
  const { count } = await supabase
    .from('knowledge_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (!count || count === 0) {
    return NextResponse.json({ error: 'Add content to your Brain first' }, { status: 400 })
  }

  // Retrieve relevant chunks
  const query = `${profile.niche} ${profile.newsletter_goal} newsletter content for ${profile.target_audience}`
  const chunks = await retrieveRelevantChunks(user.id, query)
  const contextChunks = chunks.map(c => c.content)

  // Generate draft via Claude
  const draft = await generateNewsletterDraft({ profile, contextChunks })

  // Save to DB
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

  return NextResponse.json({ id: newsletter.id, subject: newsletter.subject })
}
