'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Brain, FileText, Link2, PenLine, ArrowRight,
  CheckCircle, Sparkles, Mail, ChevronRight, Upload, Zap
} from 'lucide-react'

const sampleFiles = [
  { name: 'gear-reviews-2025.pdf', type: 'PDF', chunks: 42, icon: FileText },
  { name: 'best-trail-boots.md', type: 'Markdown', chunks: 18, icon: FileText },
  { name: 'backcountry.com/ski-review', type: 'URL', chunks: 11, icon: Link2 },
  { name: 'My voice note — Oct hiking trip', type: 'Note', chunks: 6, icon: PenLine },
]

const sampleNewsletter = {
  subject: "The boot that finally converted me to trail runners",
  body: `Hey,

I've been a boots-only hiker for 15 years. You know the type — full leather, ankle support, the whole deal. So when I told my hiking group I was switching to trail runners, they staged an intervention.

Here's what changed my mind.

After testing the Salomon Speedcross 6 on three different terrain types last month (loose scree, wet roots, hardpack), I noticed something I couldn't ignore: my knees felt better at mile 15 than they used to at mile 8. The lighter load on each step compounds over 20,000 strides.

**This week's top pick:**
Salomon Speedcross 6 — $140 at Backcountry. Worth every cent if you're covering mixed terrain.

→ Shop now

Three more things I've been thinking about:

1. The "waterproof boot" myth — GTX liners stop working after ~50 wet miles anyway
2. Why your pack weight matters more than your shoe choice above treeline
3. The one piece of gear I wish I'd bought 5 years earlier (hint: it's not footwear)

Until next week,
Luke

P.S. If you want to see my full boot vs trail runner breakdown, reply and I'll send it over.`
}

const steps = [
  {
    id: 'feed',
    icon: Brain,
    label: 'Feed your Brain',
    title: 'Upload everything you know',
    desc: 'Drop in your notes, blog posts, product reviews, bookmarked URLs — anything you\'ve written or read. Fount reads it all and builds a searchable knowledge vault from your content.',
    color: 'var(--fount-accent)',
    bg: 'var(--fount-accent-light)',
  },
  {
    id: 'learn',
    icon: Zap,
    label: 'Fount learns you',
    title: 'Your voice, indexed',
    desc: 'Every piece of content is chunked, embedded, and stored as searchable knowledge. Fount learns your writing patterns, recurring topics, opinions, and expertise — not just the words.',
    color: '#C46D5E',
    bg: '#FEF3F0',
  },
  {
    id: 'draft',
    icon: Sparkles,
    label: 'Draft generated',
    title: 'A newsletter that sounds like you',
    desc: 'When it\'s time to send, Fount searches your vault for the most relevant knowledge, combines it with your voice profile, and drafts a newsletter your subscribers can\'t tell wasn\'t written by you.',
    color: 'var(--fount-sidebar-bg)',
    bg: '#E8F0F3',
  },
]

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'note'>('upload')
  const [animating, setAnimating] = useState(false)

  function handleStepClick(i: number) {
    setAnimating(true)
    setTimeout(() => { setActiveStep(i); setAnimating(false) }, 150)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--fount-bg)' }}>

      {/* Nav */}
      <nav className="border-b" style={{ borderColor: 'var(--fount-border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: 'var(--fount-text)' }}>
            fount
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--fount-text)' }}>
              Dashboard
            </Link>
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: 'var(--fount-text)' }}>
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white"
              style={{ background: 'var(--fount-accent)' }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background: 'var(--fount-accent-light)', color: 'var(--fount-accent)' }}
        >
          <Brain size={12} />
          How the Brain works
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--fount-text)' }}>
          The AI that reads your mind,<br />then writes your newsletter
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--fount-text-muted)' }}>
          Unlike other AI writing tools that generate from thin air, Fount learns from your actual knowledge and writes in your real voice.
        </p>
      </section>

      {/* Step navigator */}
      <section className="px-6 pb-6 max-w-5xl mx-auto w-full">
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleStepClick(i)}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left"
              style={{
                borderColor: activeStep === i ? s.color : 'var(--fount-border)',
                background: activeStep === i ? s.bg : 'var(--fount-surface)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: activeStep === i ? s.color : 'var(--fount-border)' }}
              >
                <s.icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: activeStep === i ? s.color : 'var(--fount-text-muted)' }}>
                  Step {i + 1}
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>{s.label}</p>
              </div>
              {activeStep === i && <ChevronRight size={14} className="ml-auto flex-shrink-0" style={{ color: s.color }} />}
            </button>
          ))}
        </div>

        {/* Step detail */}
        <div
          className="rounded-2xl border overflow-hidden transition-opacity"
          style={{
            borderColor: 'var(--fount-border)',
            background: 'var(--fount-surface)',
            opacity: animating ? 0 : 1,
          }}
        >
          {/* Step 0 — Feed your Brain */}
          {activeStep === 0 && (
            <div className="grid grid-cols-2">
              <div className="p-8 border-r" style={{ borderColor: 'var(--fount-border)' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: 'var(--fount-accent-light)' }}
                >
                  <Brain size={20} style={{ color: 'var(--fount-accent)' }} />
                </div>
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--fount-text)' }}>{steps[0].title}</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--fount-text-muted)' }}>{steps[0].desc}</p>
                <div className="space-y-2">
                  {[
                    'PDF, DOCX, MD, TXT files',
                    'Any URL — articles, product pages, reviews',
                    'Quick text notes in your own words',
                    'Past newsletters and blog posts',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} style={{ color: 'var(--fount-accent)' }} />
                      <span className="text-sm" style={{ color: 'var(--fount-text)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock upload UI */}
              <div className="p-6" style={{ background: 'var(--fount-bg)' }}>
                <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
                  {/* Tabs */}
                  <div className="flex border-b" style={{ borderColor: 'var(--fount-border)' }}>
                    {(['upload', 'url', 'note'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors"
                        style={{
                          color: activeTab === tab ? 'var(--fount-accent)' : 'var(--fount-text-muted)',
                          borderBottom: activeTab === tab ? '2px solid var(--fount-accent)' : '2px solid transparent',
                        }}
                      >
                        {tab === 'upload' ? 'Upload' : tab === 'url' ? 'URL' : 'Note'}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {activeTab === 'upload' && (
                      <div
                        className="border-2 border-dashed rounded-lg p-6 text-center"
                        style={{ borderColor: 'var(--fount-border)' }}
                      >
                        <Upload size={20} className="mx-auto mb-2" style={{ color: 'var(--fount-text-muted)' }} />
                        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--fount-text)' }}>Drop files or click to upload</p>
                        <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>PDF, DOCX, MD, TXT</p>
                      </div>
                    )}
                    {activeTab === 'url' && (
                      <div className="space-y-2">
                        <input
                          readOnly
                          value="https://backcountry.com/salomon-speedcross-review"
                          className="w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                        />
                        <button className="w-full py-2 rounded-lg text-xs font-medium text-white" style={{ background: 'var(--fount-accent)' }}>
                          Ingest URL
                        </button>
                      </div>
                    )}
                    {activeTab === 'note' && (
                      <div className="space-y-2">
                        <textarea
                          readOnly
                          rows={3}
                          value="I prefer trail runners over boots for anything under 40 lbs pack weight. The knee savings over 20 miles is real..."
                          className="w-full rounded-lg border px-3 py-2 text-xs resize-none"
                          style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                        />
                        <button className="w-full py-2 rounded-lg text-xs font-medium text-white" style={{ background: 'var(--fount-accent)' }}>
                          Save note
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Indexed files */}
                  <div className="border-t px-4 pb-3" style={{ borderColor: 'var(--fount-border)' }}>
                    <p className="text-xs font-medium py-2.5" style={{ color: 'var(--fount-text-muted)' }}>INDEXED</p>
                    <div className="space-y-2">
                      {sampleFiles.map(f => (
                        <div key={f.name} className="flex items-center gap-2.5">
                          <f.icon size={13} style={{ color: 'var(--fount-accent)' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: 'var(--fount-text)' }}>{f.name}</p>
                          </div>
                          <span className="text-xs flex-shrink-0" style={{ color: 'var(--fount-text-muted)' }}>{f.chunks} chunks</span>
                          <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Fount learns you */}
          {activeStep === 1 && (
            <div className="grid grid-cols-2">
              <div className="p-8 border-r" style={{ borderColor: 'var(--fount-border)' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#FEF3F0' }}
                >
                  <Zap size={20} style={{ color: '#C46D5E' }} />
                </div>
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--fount-text)' }}>{steps[1].title}</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--fount-text-muted)' }}>{steps[1].desc}</p>
                <div className="space-y-3">
                  {[
                    { label: 'Writing style', value: 'Direct, opinionated, first-person' },
                    { label: 'Core topics', value: 'Gear reviews, trail running, backpacking' },
                    { label: 'Tone', value: 'Conversational but expert' },
                    { label: 'Recurring themes', value: 'Weight savings, value for money, real-world testing' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ background: 'var(--fount-bg)' }}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#C46D5E' }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--fount-text)' }}>{label}</p>
                        <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge graph visualization */}
              <div className="p-6 flex flex-col gap-4" style={{ background: 'var(--fount-bg)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--fount-text-muted)' }}>KNOWLEDGE VAULT — 77 CHUNKS INDEXED</p>
                <div className="flex-1 rounded-xl border p-4 space-y-2.5" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
                  {[
                    { topic: 'Trail running vs boots', relevance: 92, color: 'var(--fount-accent)' },
                    { topic: 'Salomon Speedcross review', relevance: 88, color: 'var(--fount-accent)' },
                    { topic: 'Pack weight optimization', relevance: 75, color: '#C46D5E' },
                    { topic: 'Waterproof vs non-waterproof', relevance: 71, color: '#C46D5E' },
                    { topic: 'Knee impact biomechanics', relevance: 64, color: 'var(--fount-sage)' },
                    { topic: 'Budget gear recommendations', relevance: 58, color: 'var(--fount-sage)' },
                  ].map(({ topic, relevance, color }) => (
                    <div key={topic}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: 'var(--fount-text)' }}>{topic}</span>
                        <span className="text-xs font-medium" style={{ color }}>{relevance}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--fount-border)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${relevance}%`, background: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="rounded-xl border p-4"
                  style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--fount-text)' }}>Voice profile learned</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Direct', 'Opinionated', 'First-person', 'Data-backed', 'Practical', 'Gear-obsessed'].map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--fount-accent-light)', color: 'var(--fount-accent)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Draft generated */}
          {activeStep === 2 && (
            <div className="grid grid-cols-2">
              <div className="p-8 border-r" style={{ borderColor: 'var(--fount-border)' }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#E8F0F3' }}
                >
                  <Sparkles size={20} style={{ color: 'var(--fount-sidebar-bg)' }} />
                </div>
                <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--fount-text)' }}>{steps[2].title}</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--fount-text-muted)' }}>{steps[2].desc}</p>

                <div className="space-y-3 mb-6">
                  {[
                    'Searches your vault for relevant knowledge',
                    'Matches your tone and writing patterns',
                    'References your specific opinions and data',
                    'Drafts subject line, body, and CTA',
                    'Notifies you to review before sending',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} style={{ color: 'var(--fount-accent)' }} />
                      <span className="text-sm" style={{ color: 'var(--fount-text)' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--fount-accent-light)', border: '1px solid #B8E4D4' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={14} style={{ color: 'var(--fount-accent)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--fount-accent)' }}>Draft ready</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--fount-text)' }}>
                    Fount emailed you: &quot;Your newsletter draft is ready — approve it in 60 seconds.&quot;
                  </p>
                </div>
              </div>

              {/* Sample newsletter preview */}
              <div className="p-6" style={{ background: 'var(--fount-bg)' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--fount-text-muted)' }}>GENERATED DRAFT</p>
                <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>Subject</p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--fount-text)' }}>{sampleNewsletter.subject}</p>
                  </div>
                  <div className="px-5 py-4 max-h-72 overflow-y-auto">
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--fount-text)' }}>
                      {sampleNewsletter.body}
                    </p>
                  </div>
                  <div className="px-5 py-3 border-t flex gap-2" style={{ borderColor: 'var(--fount-border)' }}>
                    <button
                      className="flex-1 py-2 rounded-lg text-xs font-medium text-white"
                      style={{ background: 'var(--fount-accent)' }}
                    >
                      Approve &amp; send
                    </button>
                    <button
                      className="px-3 py-2 rounded-lg text-xs font-medium border"
                      style={{ borderColor: 'var(--fount-border)', color: 'var(--fount-text)' }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--fount-border)', background: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--fount-text)' }}>
            Other AI writers vs Fount
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--fount-text-muted)' }}>
            The difference is what the AI knows before it writes.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Generic AI writer</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Writes from internet training data',
                  'Sounds like every other AI newsletter',
                  'Makes up facts and opinions',
                  'No memory between sessions',
                  'Gets filtered as AI-generated spam',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs">✕</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--fount-text-muted)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--fount-accent)', background: 'var(--fount-accent-light)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--fount-accent)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Fount</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Writes from your knowledge vault',
                  'Sounds like you specifically',
                  'References your real opinions and data',
                  'Learns more with every file you add',
                  'Reads like a human — because it\'s your words',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--fount-accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--fount-text)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t" style={{ borderColor: 'var(--fount-border)' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--fount-text)' }}>
          Ready to feed your Brain?
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--fount-text-muted)' }}>
          Free to start. Your first draft is one upload away.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--fount-accent)' }}
        >
          Start for free
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--fount-border)' }}>
        <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>fount</Link>
        <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>
          &copy; {new Date().getFullYear()} Fount. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
