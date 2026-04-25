import Link from 'next/link'
import { Brain, Mail, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default async function Home() {

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--fount-bg)' }}>

      {/* Nav */}
      <nav className="border-b" style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--fount-text)' }}>fount</span>
            <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ background: 'var(--fount-sage)', color: 'var(--fount-text)' }}>beta</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/how-it-works"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--fount-text)' }}
            >
              How it works
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--fount-text)' }}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: 'var(--fount-text)' }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--fount-accent)' }}
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'var(--fount-accent-light)', color: 'var(--fount-accent)' }}
        >
          <Sparkles size={12} />
          AI newsletter agent — now in beta
        </div>

        <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-2xl mb-6" style={{ color: 'var(--fount-text)' }}>
          Your newsletter, written by an AI that actually knows you
        </h1>

        <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: 'var(--fount-text-muted)' }}>
          Fount reads your notes, past writing, and product knowledge — then drafts your newsletter in your voice, every week. You approve in 60 seconds. It sends.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--fount-accent)' }}
          >
            Start for free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl text-sm font-semibold border transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--fount-border)', color: 'var(--fount-text)' }}
          >
            Sign in
          </Link>
        </div>

        <p className="text-xs mt-4" style={{ color: 'var(--fount-text-muted)' }}>
          No credit card required
        </p>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--fount-border)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--fount-text)' }}>
            How it works
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--fount-text-muted)' }}>
            Three steps. Then it runs itself.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Brain,
                title: 'Feed your Brain',
                desc: 'Upload notes, past writing, product info, or any URLs. Fount indexes everything and learns your voice, knowledge, and style.',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Fount drafts for you',
                desc: 'Every week, Fount searches your knowledge vault and writes a newsletter that sounds like you — not like generic AI.',
              },
              {
                step: '03',
                icon: Mail,
                title: 'Approve and send',
                desc: 'Review your draft, edit if you want, then hit send. Your subscribers get a polished, personal newsletter every time.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold" style={{ color: 'var(--fount-accent)' }}>{step}</span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--fount-accent-light)' }}
                  >
                    <Icon size={18} style={{ color: 'var(--fount-accent)' }} />
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fount-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fount-text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t" style={{ borderColor: 'var(--fount-border)', background: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--fount-text)' }}>
            Everything you need. Nothing you don&apos;t.
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {[
              { title: 'Second brain reader', desc: 'Upload PDFs, docs, URLs, or write notes. Fount embeds and indexes everything so drafts pull from your actual knowledge.' },
              { title: 'Sounds like you', desc: 'Built on your own writing samples and voice profile. The longer you use it, the more accurate it gets.' },
              { title: 'Approval-first', desc: 'Fount never sends without you. Every draft lands in your inbox for review. Edit freely or approve as-is.' },
              { title: 'Affiliate revenue tracking', desc: 'See exactly how much affiliate revenue each newsletter generated. The data your current tool doesn\'t show you.' },
              { title: 'Subscriber management', desc: 'Import your list via CSV, add subscribers manually, or embed a signup form on your site.' },
              { title: 'Deliverability built in', desc: 'Proper unsubscribe handling, CAN-SPAM compliance, and content that reads human — because it\'s built from your words.' },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="flex gap-3 p-5 rounded-xl border"
                style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)' }}
              >
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--fount-accent)' }} />
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--fount-text)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--fount-text-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t" style={{ borderColor: 'var(--fount-border)' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--fount-text)' }}>
          Ready to let Fount write your newsletter?
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--fount-text-muted)' }}>
          Free to start. No credit card. Cancel anytime.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--fount-accent)' }}
        >
          Get started free
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--fount-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>fount</span>
        <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>
          &copy; {new Date().getFullYear()} Fount. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
