const CHUNK_SIZE = 1800  // ~450 tokens
const CHUNK_OVERLAP = 200

export function chunkText(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length === 0) return []

  const chunks: string[] = []
  let start = 0

  while (start < cleaned.length) {
    const end = Math.min(start + CHUNK_SIZE, cleaned.length)
    let chunkEnd = end

    // Try to break at a sentence boundary
    if (end < cleaned.length) {
      const lastPeriod = cleaned.lastIndexOf('.', end)
      const lastNewline = cleaned.lastIndexOf('\n', end)
      const boundary = Math.max(lastPeriod, lastNewline)
      if (boundary > start + CHUNK_SIZE / 2) {
        chunkEnd = boundary + 1
      }
    }

    const chunk = cleaned.slice(start, chunkEnd).trim()
    if (chunk.length > 80) chunks.push(chunk)

    start = chunkEnd - CHUNK_OVERLAP
    if (start >= cleaned.length) break
  }

  return chunks
}
