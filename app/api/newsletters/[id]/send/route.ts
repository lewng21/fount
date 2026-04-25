import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { Resend } from 'resend'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const [{ data: newsletter }, { data: profile }, { data: subscribers }] = await Promise.all([
    supabase.from('newsletters').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('user_profiles').select('from_name, reply_to_email').eq('id', user.id).single(),
    supabase.from('subscribers').select('email, first_name').eq('user_id', user.id).eq('status', 'active'),
  ])

  if (!newsletter) return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 })
  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })
  }

  const fromName = profile?.from_name ?? 'Fount Newsletter'
  const replyTo = profile?.reply_to_email ?? user.email ?? undefined

  let sent = 0
  const errors: string[] = []

  for (const sub of subscribers) {
    const unsubLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscribers/unsubscribe?email=${encodeURIComponent(sub.email)}&uid=${user.id}`
    const htmlWithFooter = `${newsletter.content}
<p style="margin-top:32px;font-size:12px;color:#888;">
  You're receiving this because you subscribed to ${fromName}.
  <a href="${unsubLink}">Unsubscribe</a>
</p>`

    try {
      await resend.emails.send({
        from: `${fromName} <hello@fount.app>`,
        to: sub.email,
        replyTo: replyTo,
        subject: newsletter.subject ?? '(No subject)',
        html: htmlWithFooter,
      })
      sent++
    } catch (e) {
      errors.push(sub.email)
    }
  }

  await admin
    .from('newsletters')
    .update({ status: 'sent', sent_at: new Date().toISOString(), recipient_count: sent })
    .eq('id', id)

  return NextResponse.json({ sent, errors })
}
