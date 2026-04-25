'use client'

import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'

const toneOptions = [
  { value: 'casual', label: 'Casual', desc: 'Friendly and conversational, like texting a friend' },
  { value: 'professional', label: 'Professional', desc: 'Polished and authoritative, expert voice' },
  { value: 'conversational', label: 'Conversational', desc: 'Warm and engaging, like a blog post' },
]

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
]

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    display_name: '',
    niche: '',
    target_audience: '',
    tone: 'conversational',
    sample_sentences: '',
    newsletter_goal: 'educate',
    send_frequency: 'weekly',
    send_day: 'Tuesday',
    from_name: '',
    reply_to_email: '',
  })

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // TODO: POST to /api/settings
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
          Configure your voice profile and newsletter preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity */}
        <section className="rounded-xl border p-6 space-y-4" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Identity</h2>
          <Field label="Your name or brand">
            <input type="text" value={form.display_name} onChange={e => update('display_name', e.target.value)} placeholder="e.g. Luke Wong" className={inputCls} style={inputStyle} />
          </Field>
          <Field label="From name (shown in inbox)">
            <input type="text" value={form.from_name} onChange={e => update('from_name', e.target.value)} placeholder="e.g. Luke from Fount" className={inputCls} style={inputStyle} />
          </Field>
          <Field label="Reply-to email">
            <input type="email" value={form.reply_to_email} onChange={e => update('reply_to_email', e.target.value)} placeholder="you@example.com" className={inputCls} style={inputStyle} />
          </Field>
        </section>

        {/* Voice profile */}
        <section className="rounded-xl border p-6 space-y-4" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Voice profile</h2>
          <Field label="Your niche or topic area">
            <input type="text" value={form.niche} onChange={e => update('niche', e.target.value)} placeholder="e.g. Outdoor gear for hikers and backpackers" className={inputCls} style={inputStyle} />
          </Field>
          <Field label="Target audience">
            <input type="text" value={form.target_audience} onChange={e => update('target_audience', e.target.value)} placeholder="e.g. Weekend hikers who want quality gear recommendations" className={inputCls} style={inputStyle} />
          </Field>
          <Field label="Tone">
            <div className="grid grid-cols-3 gap-2">
              {toneOptions.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('tone', value)}
                  className="rounded-lg border p-3 text-left transition-colors"
                  style={{
                    borderColor: form.tone === value ? 'var(--fount-accent)' : 'var(--fount-border)',
                    background: form.tone === value ? 'var(--fount-accent-light)' : 'transparent',
                  }}
                >
                  <p className="text-sm font-medium" style={{ color: form.tone === value ? 'var(--fount-accent)' : 'var(--fount-text)' }}>{label}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--fount-text-muted)' }}>{desc}</p>
                </button>
              ))}
            </div>
          </Field>
          <Field label="3-5 sentences in your own voice" hint="Fount uses these as examples when drafting">
            <textarea
              value={form.sample_sentences}
              onChange={e => update('sample_sentences', e.target.value)}
              rows={4}
              placeholder="Write a few sentences the way you naturally write..."
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          </Field>
          <Field label="Newsletter goal">
            <select value={form.newsletter_goal} onChange={e => update('newsletter_goal', e.target.value)} className={inputCls} style={inputStyle}>
              <option value="educate">Educate my audience</option>
              <option value="sell">Drive affiliate/product sales</option>
              <option value="entertain">Entertain and engage</option>
              <option value="mix">A mix of all three</option>
            </select>
          </Field>
        </section>

        {/* Schedule */}
        <section className="rounded-xl border p-6 space-y-4" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Send schedule</h2>
          <Field label="Frequency">
            <div className="flex gap-2">
              {frequencyOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('send_frequency', value)}
                  className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
                  style={{
                    borderColor: form.send_frequency === value ? 'var(--fount-accent)' : 'var(--fount-border)',
                    background: form.send_frequency === value ? 'var(--fount-accent-light)' : 'transparent',
                    color: form.send_frequency === value ? 'var(--fount-accent)' : 'var(--fount-text-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Send day">
            <div className="flex gap-2">
              {dayOptions.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => update('send_day', day)}
                  className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
                  style={{
                    borderColor: form.send_day === day ? 'var(--fount-accent)' : 'var(--fount-border)',
                    background: form.send_day === day ? 'var(--fount-accent-light)' : 'transparent',
                    color: form.send_day === day ? 'var(--fount-accent)' : 'var(--fount-text-muted)',
                  }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </Field>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--fount-accent)' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save settings
        </button>
      </form>
    </div>
  )
}

const inputCls = 'w-full rounded-lg border px-3 py-2.5 text-sm outline-none'
const inputStyle = { borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>
        {label}
      </label>
      {hint && <p className="text-xs mb-2" style={{ color: 'var(--fount-text-muted)' }}>{hint}</p>}
      {children}
    </div>
  )
}
