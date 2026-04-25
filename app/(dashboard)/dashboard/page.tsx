import { createClient } from '@/lib/supabase/server'
import { Mail, Users, TrendingUp, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
          {user?.email ?? 'Previewing as guest'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Subscribers', value: '—', icon: Users, note: 'Import your first list' },
          { label: 'Newsletters sent', value: '0', icon: Mail, note: 'No newsletters yet' },
          { label: 'Avg. open rate', value: '—', icon: TrendingUp, note: 'Send one to find out' },
        ].map(({ label, value, icon: Icon, note }) => (
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

      {/* Next action */}
      <div
        className="rounded-xl border p-6 flex items-start gap-4"
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

      {/* Recent newsletters */}
      <div className="mt-8">
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--fount-text)' }}>Recent newsletters</h2>
        <div
          className="rounded-xl border"
          style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}
        >
          <div className="px-6 py-10 text-center">
            <Mail size={32} className="mx-auto mb-3" style={{ color: 'var(--fount-text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>No newsletters yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
              Feed your Brain and Fount will generate your first draft automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
