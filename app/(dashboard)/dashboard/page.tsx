import { createClient } from '@/lib/supabase/server'
import { Mail, Users, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { count: subscriberCount },
    { count: sentCount },
    { data: recentNewsletters },
    { count: brainCount },
  ] = await Promise.all([
    supabase
      .from('subscribers')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .eq('status', 'active'),
    supabase
      .from('newsletters')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .eq('status', 'sent'),
    supabase
      .from('newsletters')
      .select('id, subject, status, created_at, recipient_count')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('knowledge_files')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user!.id),
  ])

  const stats = [
    {
      label: 'Subscribers',
      value: subscriberCount !== null ? subscriberCount.toString() : '—',
      icon: Users,
      note: subscriberCount === 0 ? 'Add your first subscriber' : `${subscriberCount} active`,
    },
    {
      label: 'Newsletters sent',
      value: sentCount !== null ? sentCount.toString() : '0',
      icon: Mail,
      note: sentCount === 0 ? 'No newsletters sent yet' : 'total sent',
    },
    {
      label: 'Brain files',
      value: brainCount !== null ? brainCount.toString() : '—',
      icon: TrendingUp,
      note: brainCount === 0 ? 'Upload your first file' : `${brainCount} uploaded`,
    },
  ]

  const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
    draft: { label: 'Draft', bg: '#F3F4F6', color: '#6B7280' },
    approved: { label: 'Approved', bg: '#ECFDF5', color: '#059669' },
    scheduled: { label: 'Scheduled', bg: '#EFF6FF', color: '#3B82F6' },
    sent: { label: 'Sent', bg: '#F5F3FF', color: '#7C3AED' },
  }

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
          {user?.email ?? 'Previewing as guest'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, note }) => (
          <div
            key={label}
            className="rounded-xl border p-5"
            style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--fount-text-muted)' }}>{label}</span>
              <Icon size={16} style={{ color: 'var(--fount-text-muted)' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--fount-text-muted)' }}>{note}</p>
          </div>
        ))}
      </div>

      {/* Next action — show if brain is empty */}
      {brainCount === 0 && (
        <div
          className="rounded-xl border p-6 flex items-start gap-4 mb-8"
          style={{ background: 'var(--fount-accent-light)', borderColor: '#DDD6FE' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--fount-accent)' }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--fount-text)' }}>
              Set up your Brain to get started
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
              Upload your notes, past writing, or product info. Fount learns from your knowledge to draft newsletters that sound like you.
            </p>
            <a
              href="/brain"
              className="inline-block mt-3 text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--fount-accent)' }}
            >
              Go to Brain
            </a>
          </div>
        </div>
      )}

      {/* Recent newsletters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--fount-text)' }}>Recent newsletters</h2>
          {(recentNewsletters?.length ?? 0) > 0 && (
            <Link href="/newsletters" className="text-sm" style={{ color: 'var(--fount-accent)' }}>
              View all
            </Link>
          )}
        </div>
        <div
          className="rounded-xl border"
          style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}
        >
          {!recentNewsletters || recentNewsletters.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Mail size={32} className="mx-auto mb-3" style={{ color: 'var(--fount-text-muted)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>No newsletters yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
                Feed your Brain and Fount will generate your first draft automatically.
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'var(--fount-border)' }}>
              {recentNewsletters.map(n => {
                const s = statusStyles[n.status] ?? statusStyles.draft
                return (
                  <li key={n.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/newsletters/${n.id}`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: 'var(--fount-text)' }}
                      >
                        {n.subject || 'Untitled draft'}
                      </Link>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--fount-text-muted)' }}>
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
