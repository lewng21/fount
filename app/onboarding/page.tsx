'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

const steps = ['Your niche', 'Your voice', 'Schedule']

const toneOptions = [
  { value: 'casual', label: 'Casual', desc: 'Friendly, like texting a friend' },
  { value: 'professional', label: 'Professional', desc: 'Polished expert voice' },
  { value: 'conversational', label: 'Conversational', desc: 'Warm blog-post feel' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    niche: '',
    target_audience: '',
    tone: 'conversational',
    sample_sentences: '',
    newsletter_goal: 'mix',
    send_frequency: 'weekly',
    send_day: 'Tuesday',
  })

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleFinish() {
    setSaving(true)
    // TODO: POST to /api/onboarding
    setTimeout(() => {
      setSaving(false)
      router.push('/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--fount-bg)' }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fount-text)' }}>fount</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>Let&apos;s set up your newsletter</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full h-1 rounded-full transition-colors"
                style={{ background: i <= step ? 'var(--fount-accent)' : 'var(--fount-border)' }}
              />
              <span className="text-xs" style={{ color: i <= step ? 'var(--fount-accent)' : 'var(--fount-text-muted)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border p-8" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--fount-text)' }}>What&apos;s your newsletter about?</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>Fount uses this to understand your content and draft relevant newsletters.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>Your niche</label>
                <input
                  type="text"
                  value={form.niche}
                  onChange={e => update('niche', e.target.value)}
                  placeholder="e.g. Outdoor gear for hikers and backpackers"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>Your target audience</label>
                <input
                  type="text"
                  value={form.target_audience}
                  onChange={e => update('target_audience', e.target.value)}
                  placeholder="e.g. Weekend hikers who want quality gear recommendations"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fount-text)' }}>Newsletter goal</label>
                <select
                  value={form.newsletter_goal}
                  onChange={e => update('newsletter_goal', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                >
                  <option value="educate">Educate my audience</option>
                  <option value="sell">Drive affiliate / product sales</option>
                  <option value="entertain">Entertain and engage</option>
                  <option value="mix">A mix of all three</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--fount-text)' }}>What&apos;s your writing voice?</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>The more Fount knows about your style, the more it sounds like you.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fount-text)' }}>Tone</label>
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
                      <p className="text-xs mt-0.5" style={{ color: 'var(--fount-text-muted)' }}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fount-text)' }}>
                  Write 2-3 sentences in your natural voice
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--fount-text-muted)' }}>
                  Fount will match this style when drafting. The more specific, the better.
                </p>
                <textarea
                  value={form.sample_sentences}
                  onChange={e => update('sample_sentences', e.target.value)}
                  rows={4}
                  placeholder="I've been hiking for 15 years and nothing frustrates me more than gear that looks good on paper but falls apart on the trail..."
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--fount-text)' }}>When should Fount send?</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
                  Fount will generate a draft before your send day for you to approve.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fount-text)' }}>Frequency</label>
                <div className="flex gap-2">
                  {[['weekly', 'Weekly'], ['biweekly', 'Every 2 weeks'], ['monthly', 'Monthly']].map(([value, label]) => (
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fount-text)' }}>Send day</label>
                <div className="flex gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
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
              </div>

              <div
                className="rounded-lg p-4 mt-2"
                style={{ background: 'var(--fount-accent-light)', border: '1px solid #DDD6FE' }}
              >
                <p className="text-sm" style={{ color: 'var(--fount-text)' }}>
                  Fount will draft your newsletter <strong>{form.send_frequency === 'weekly' ? 'every week' : form.send_frequency === 'biweekly' ? 'every two weeks' : 'every month'}</strong> and notify you to approve before it goes out every <strong>{form.send_day}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--fount-border)', color: 'var(--fount-text)' }}
              >
                <ArrowLeft size={15} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && !form.niche.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'var(--fount-accent)' }}
              >
                Continue
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--fount-accent)' }}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                Go to dashboard
                {!saving && <ArrowRight size={15} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
