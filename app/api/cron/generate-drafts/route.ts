import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { retrieveRelevantChunks } from '@/lib/rag'
import { generateNewsletterDraft } from '@/lib/claude'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all users with auto_draft enabled and a complete profile
  const { data: profiles } = await admin
    .from('user_profiles')
    .select('id, niche, target_audience, tone, sample_sentences, newsletter_goal, display_name, from_name')
    .eq('auto_draft_enabled', true)
    .eq('onboarding_complete', true)
    .not('niche', 'is', null)

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ generated: 0 })
  }

  const results = []

  for (const profile of profiles) {
    try {
      const { count } = await admin
        .from('knowledge_chunks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      if (!count || count === 0) continue

      const query = `${profile.niche} ${profile.newsletter_goal} newsletter for ${profile.target_audience}`
      const chunks = await retrieveRelevantChunks(profile.id, query)
      const draft = await generateNewsletterDraft({ profile, contextChunks: chunks.map(c => c.content) })

      await admin.from('newsletters').insert({
        user_id: profile.id,
        subject: draft.subject,
        content: draft.content,
        content_text: draft.contentText,
        status: 'draft',
      })

      results.push({ userId: profile.id, subject: draft.subject })
    } catch (e) {
      results.push({ userId: profile.id, error: String(e) })
    }
  }

  return NextResponse.json({ generated: results.filter(r => !('error' in r)).length, results })
}
