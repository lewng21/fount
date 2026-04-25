'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, Check, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Newsletter = {
  id: string
  subject: string
  content: string
  status: string
  created_at: string
  recipient_count?: number
}

const statusStyles: Record<string, { label: string; bg: string; color: string }> = {
  draft:    { label: 'Draft',     bg: '#F3F4F6', color: '#6B7280' },
  approved: { label: 'Approved',  bg: '#ECFDF5', color: '#059669' },
  sent:     { label: 'Sent',      bg: '#E8F0F3', color: 'var(--fount-sidebar-bg)' },
}

export default function NewsletterEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [subject, setSubject] = useState('')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] px-6 py-5',
        style: 'color: var(--fount-text); font-size: 15px; line-height: 1.7;',
      },
    },
  })

  useEffect(() => {
    fetch(`/api/newsletters/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setNewsletter(data)
        setSubject(data.subject ?? '')
        editor?.commands.setContent(data.content ?? '')
      })
  }, [id, editor])

  const handleSave = useCallback(async () => {
    if (!editor) return
    setSaving(true)
    const res = await fetch(`/api/newsletters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content: editor.getHTML(), content_text: editor.getText() }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  }, [editor, id, subject])

  const handleApprove = async () => {
    await fetch(`/api/newsletters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    })
    setNewsletter(n => n ? { ...n, status: 'approved' } : n)
  }

  const handleSend = async () => {
    if (!confirm('Send this newsletter to all active subscribers?')) return
    setSending(true)
    const res = await fetch(`/api/newsletters/${id}/send`, { method: 'POST' })
    const data = await res.json()
    setSending(false)
    if (res.ok) {
      alert(`Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}!`)
      router.push('/newsletters')
    } else {
      setError(data.error ?? 'Send failed')
    }
  }

  if (error) return (
    <div className="px-8 py-8">
      <p className="text-red-600">{error}</p>
      <Link href="/newsletters" className="text-sm underline mt-2 inline-block" style={{ color: 'var(--fount-accent)' }}>Back to newsletters</Link>
    </div>
  )

  if (!newsletter) return (
    <div className="px-8 py-8 flex items-center gap-2" style={{ color: 'var(--fount-text-muted)' }}>
      <Loader2 size={16} className="animate-spin" /> Loading draft...
    </div>
  )

  const status = statusStyles[newsletter.status] ?? statusStyles.draft

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/newsletters"
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--fount-text-muted)' }}
        >
          <ArrowLeft size={15} /> All newsletters
        </Link>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--fount-border)', color: 'var(--fount-text)' }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} className="text-green-500" /> : <Save size={13} />}
            {saved ? 'Saved' : 'Save'}
          </button>
          {newsletter.status === 'draft' && (
            <button
              onClick={handleApprove}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium"
              style={{ borderColor: 'var(--fount-accent)', color: 'var(--fount-accent)' }}
            >
              Approve
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={sending || newsletter.status === 'sent'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: 'var(--fount-accent)' }}
          >
            {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            Send
          </button>
        </div>
      </div>

      {/* Editor card */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
        {/* Subject */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)' }}>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--fount-text-muted)' }}>SUBJECT LINE</label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Enter subject line..."
            className="w-full text-base font-semibold bg-transparent outline-none"
            style={{ color: 'var(--fount-text)' }}
          />
        </div>

        {/* Tiptap editor */}
        <div className="border-b" style={{ borderColor: 'var(--fount-border)' }}>
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'var(--fount-bg)' }}>
          <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>
            {editor?.storage?.characterCount?.words?.() ?? 0} words
          </p>
          <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>
            Generated by Fount Brain · {new Date(newsletter.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
