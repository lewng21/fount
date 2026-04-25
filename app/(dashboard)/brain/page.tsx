'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Link, FileText, Loader2, CheckCircle, Trash2, Brain, AlertCircle } from 'lucide-react'

type KnowledgeFile = {
  id: string
  filename: string
  source_type: 'upload' | 'url' | 'note'
  source_url?: string
  status: 'processing' | 'ready' | 'failed'
  chunk_count: number
  created_at: string
}

export default function BrainPage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [tab, setTab] = useState<'upload' | 'url' | 'note'>('upload')
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchFiles = useCallback(async () => {
    const res = await fetch('/api/brain/files')
    const data = await res.json()
    setFiles(Array.isArray(data) ? data : [])
    setFetching(false)
  }, [])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setError('')
    setLoading(true)
    for (const file of Array.from(fileList)) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/brain/upload', { method: 'POST', body: form })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Upload failed') }
    }
    setLoading(false)
    fetchFiles()
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    setLoading(true)
    const res = await fetch('/api/brain/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error ?? 'Failed to ingest URL')
    setLoading(false)
    setUrl('')
    fetchFiles()
  }

  async function handleNoteSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setError('')
    setLoading(true)
    const res = await fetch('/api/brain/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note }),
    })
    const data = await res.json()
    if (!res.ok) setError(data.error ?? 'Failed to save note')
    setLoading(false)
    setNote('')
    fetchFiles()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this file from your Brain?')) return
    await fetch(`/api/brain/${id}`, { method: 'DELETE' })
    setFiles(f => f.filter(x => x.id !== id))
  }

  const totalChunks = files.reduce((sum, f) => sum + (f.chunk_count ?? 0), 0)

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fount-text)' }}>Brain</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--fount-text-muted)' }}>
          Your knowledge vault — {files.length} files, {totalChunks} indexed chunks
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        {/* Ingestion panel */}
        <div className="col-span-2">
          <div className="rounded-xl border" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
            <div className="flex border-b" style={{ borderColor: 'var(--fount-border)' }}>
              {(['upload', 'url', 'note'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="flex-1 py-3 text-sm font-medium capitalize transition-colors"
                  style={{
                    color: tab === key ? 'var(--fount-accent)' : 'var(--fount-text-muted)',
                    borderBottom: tab === key ? '2px solid var(--fount-accent)' : '2px solid transparent',
                  }}
                >
                  {key === 'upload' ? 'Upload' : key === 'url' ? 'URL' : 'Note'}
                </button>
              ))}
            </div>

            <div className="p-5">
              {tab === 'upload' && (
                <div>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files) }}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                    style={{
                      borderColor: dragOver ? 'var(--fount-accent)' : 'var(--fount-border)',
                      background: dragOver ? 'var(--fount-accent-light)' : 'transparent',
                    }}
                  >
                    {loading ? (
                      <Loader2 size={24} className="mx-auto mb-2 animate-spin" style={{ color: 'var(--fount-accent)' }} />
                    ) : (
                      <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--fount-text-muted)' }} />
                    )}
                    <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>
                      {loading ? 'Processing...' : 'Drop files or click to upload'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--fount-text-muted)' }}>PDF, DOCX, MD, TXT</p>
                  </div>
                  <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.md,.txt" className="hidden" onChange={e => handleFileUpload(e.target.files)} />
                </div>
              )}

              {tab === 'url' && (
                <form onSubmit={handleUrlSubmit} className="space-y-3">
                  <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>Paste a URL and Fount will scrape and index it.</p>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://yoursite.com/article"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-60"
                    style={{ background: 'var(--fount-accent)' }}
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Link size={14} />}
                    Ingest URL
                  </button>
                </form>
              )}

              {tab === 'note' && (
                <form onSubmit={handleNoteSubmit} className="space-y-3">
                  <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>Write anything — ideas, opinions, product thoughts. Every note trains your Brain.</p>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={6}
                    placeholder="Write a note in your own voice..."
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none resize-none"
                    style={{ borderColor: 'var(--fount-border)', background: 'var(--fount-bg)', color: 'var(--fount-text)' }}
                  />
                  <button
                    type="submit"
                    disabled={loading || !note.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white disabled:opacity-60"
                    style={{ background: 'var(--fount-accent)' }}
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                    Save note
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Knowledge files list */}
        <div className="col-span-3">
          <div className="rounded-xl border" style={{ background: 'var(--fount-surface)', borderColor: 'var(--fount-border)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--fount-border)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--fount-text)' }}>Knowledge vault</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--fount-accent-light)', color: 'var(--fount-accent)' }}>
                {files.length} files
              </span>
            </div>

            {fetching ? (
              <div className="px-5 py-12 flex items-center justify-center gap-2" style={{ color: 'var(--fount-text-muted)' }}>
                <Loader2 size={16} className="animate-spin" /> Loading...
              </div>
            ) : files.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Brain size={32} className="mx-auto mb-3" style={{ color: 'var(--fount-text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--fount-text)' }}>Your Brain is empty</p>
                <p className="text-xs mt-1" style={{ color: 'var(--fount-text-muted)' }}>Upload files, paste URLs, or write notes to get started.</p>
              </div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--fount-border)' }}>
                {files.map(file => (
                  <li key={file.id} className="px-5 py-3.5 flex items-center gap-3">
                    <FileText size={16} style={{ color: 'var(--fount-accent)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--fount-text)' }}>{file.filename}</p>
                      <p className="text-xs" style={{ color: 'var(--fount-text-muted)' }}>
                        {file.chunk_count} chunks · {file.source_type} · {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {file.status === 'ready' && <CheckCircle size={15} className="text-green-500 flex-shrink-0" />}
                    {file.status === 'processing' && <Loader2 size={15} className="animate-spin flex-shrink-0" style={{ color: 'var(--fount-text-muted)' }} />}
                    {file.status === 'failed' && <AlertCircle size={15} className="text-red-500 flex-shrink-0" />}
                    <button onClick={() => handleDelete(file.id)} className="flex-shrink-0 p-1 rounded hover:text-red-500 transition-colors" style={{ color: 'var(--fount-text-muted)' }}>
                      <Trash2 size={14} />
                    </button>
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
