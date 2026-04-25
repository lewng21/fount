import { Mail, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
  draft: { label: 'Draft', bg: '#F3F4F6', color: '#6B7280' },
  approved: { label: 'Approved', bg: '#ECFDF5', color: '#059669' },
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', color: '#3B82F6' },
  sent: { label: 'Sent', bg: '#F5F3FF', color: '#7C3AED' },
}

export default function NewslettersPage() {
  const newsletters: { id: string; subject: string; status: string; created_at: string; recipient_count?: number }[] = []

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>Newsletters</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
            Drafts, scheduled, and sent newsletters
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--fount-accent)' }}
        >
          <Sparkles size={15} />
          Generate draft
        </button>
      </div>

      <div className="rounded-xl border" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
        {/* Table header */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-xs font-medium border-b"
          style={{ color: 'var(--fount-text-muted)', borderColor: 'var(--fount-border)' }}
        >
          <span className="col-span-6">Subject</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2 text-right">Recipients</span>
        </div>

        {newsletters.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Mail size={32} className="mx-auto mb-3" style={{ color: 'var(--fount-text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>No newsletters yet</p>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--fount-text-muted)' }}>
              Feed your Brain first, then generate your first draft.
            </p>
            <Link
              href="/brain"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: 'var(--fount-accent)' }}
            >
              <Plus size={15} />
              Add to Brain
            </Link>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--fount-border)' }}>
            {newsletters.map(n => {
              const s = statusStyles[n.status] ?? statusStyles.draft
              return (
                <li key={n.id} className="grid grid-cols-12 px-5 py-4 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-6">
                    <Link href={`/newsletters/${n.id}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--fount-text)' }}>
                      {n.subject || 'Untitled draft'}
                    </Link>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm" style={{ color: 'var(--fount-text-muted)' }}>
                    {new Date(n.created_at).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 text-right text-sm" style={{ color: 'var(--fount-text-muted)' }}>
                    {n.recipient_count ?? '—'}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
