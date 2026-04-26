import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const { error } = await admin
    .from('user_profiles')
    .upsert({
      id: user.id,
      niche: body.niche,
      target_audience: body.target_audience,
      tone: body.tone,
      sample_sentences: body.sample_sentences,
      newsletter_goal: body.newsletter_goal,
      send_frequency: body.send_frequency,
      send_day: body.send_day,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
