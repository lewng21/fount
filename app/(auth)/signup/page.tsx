'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  return (
    <div className="rounded-2xl border p-8 shadow-sm" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
      <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--fount-text)' }}>Create your account</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--fount-text-muted)' }}>Start your AI newsletter in minutes</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
            style={{
              borderColor: 'var(--fount-border)',
              background: 'var(--fount-bg)',
              color: 'var(--fount-text)',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors"
            style={{
              borderColor: 'var(--fount-border)',
              background: 'var(--fount-bg)',
              color: 'var(--fount-text)',
            }}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--fount-accent)' }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create account
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--fount-text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-medium" style={{ color: 'var(--fount-accent)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
