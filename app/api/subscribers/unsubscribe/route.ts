import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const uid = searchParams.get('uid')

  if (!email || !uid) {
    return new NextResponse('Invalid unsubscribe link', { status: 400 })
  }

  await admin
    .from('subscribers')
    .update({ status: 'unsubscribed' })
    .eq('user_id', uid)
    .eq('email', email)

  return new NextResponse(
    `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
      <h2>You've been unsubscribed</h2>
      <p>You won't receive any more emails from this newsletter.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
