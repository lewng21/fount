'use client'

import { useState, useEffect } from 'react'
import { Users, Upload, UserPlus, Loader2, Trash2 } from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  first_name?: string
  status: string
  subscribed_at: string
}

export default function SubscribersPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  async function loadSubscribers() {
    const res = await fetch('/api/subscribers')
    const data = await res.json()
    setSubscribers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSubscribers() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setAdding(true)
    await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), first_name: name.trim() || undefined }),
    })
    setEmail('')
    setName('')
    setAdding(false)
    await loadSubscribers()
  }

  const activeCount = subscribers.filter(s => s.status === 'active').length

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>Subscribers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
            Manage your newsletter audience
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--fount-border)', color: 'var(--fount-text)' }}
        >
          <Upload size={15} />
          Import CSV
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Add subscriber form */}
        <div className="col-span-2">
          <div className="rounded-xl border p-5" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--fount-text)' }}>Add subscriber</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name (optional)"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
              />
              <button
                type="submit"
                disabled={adding || !email.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-60"
                style={{ background: 'var(--fount-accent)' }}
              >
                {adding ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                Add subscriber
              </button>
            </form>
          </div>
        </div>

        {/* Subscriber list */}
        <div className="col-span-3">
          <div className="rounded-xl border" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--fount-border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Subscribers</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--fount-accent-light)', color: 'var(--fount-accent)' }}>
                {loading ? '…' : `${activeCount} active`}
              </span>
            </div>

            {loading ? (
              <div className="px-5 py-10 flex justify-center">
                <Loader2 size={20} className="animate-spin" style={{ color: 'var(--fount-text-muted)' }} />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Users size={32} className="mx-auto mb-3" style={{ color: 'var(--fount-text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>No subscribers yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--fount-text-muted)' }}>
                  Add individually or import a CSV list.
                </p>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--fount-border)' }}>
                {subscribers.map(s => (
                  <li key={s.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
                      style={{ background: 'var(--fount-accent)' }}
                    >
                      {(s.first_name?.[0] ?? s.email[0]).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      {s.first_name && <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>{s.first_name}</p>}
                      <p className="text-sm truncate" style={{ color: 'var(--fount-text-muted)' }}>{s.email}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: s.status === 'active' ? '#ECFDF5' : '#F3F4F6',
                        color: s.status === 'active' ? '#059669' : '#6B7280',
                      }}
                    >
                      {s.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
