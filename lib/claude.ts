import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

type UserProfile = {
  niche?: string | null
  target_audience?: string | null
  tone?: string | null
  sample_sentences?: string | null
  newsletter_goal?: string | null
  display_name?: string | null
}

type GenerateDraftOptions = {
  profile: UserProfile
  contextChunks: string[]
}

type DraftResult = {
  subject: string
  content: string
  contentText: string
}

export async function generateNewsletterDraft({
  profile,
  contextChunks,
}: GenerateDraftOptions): Promise<DraftResult> {
  const systemPrompt = buildSystemPrompt(profile)
  const userPrompt = buildUserPrompt(profile, contextChunks)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  return parseDraft(raw)
}

function buildSystemPrompt(profile: UserProfile): string {
  return `You are a ghostwriter for ${profile.display_name ?? 'a creator'}.

Your job is to write their newsletter exactly as they would write it — not as a generic AI.

THEIR NICHE: ${profile.niche ?? 'not specified'}
THEIR AUDIENCE: ${profile.target_audience ?? 'not specified'}
THEIR TONE: ${profile.tone ?? 'conversational'}
THEIR GOAL: ${profile.newsletter_goal ?? 'mix of education and engagement'}

${profile.sample_sentences ? `EXAMPLES OF THEIR WRITING VOICE:
${profile.sample_sentences}

Match this voice precisely. Use their sentence structure, vocabulary, and rhythm.` : ''}

RULES:
- Write in first person
- Sound like a human expert, not an AI
- Reference specific details from the knowledge context provided
- Never make up facts or statistics not in the context
- Include one clear call to action
- Keep it 350-550 words
- Write a compelling subject line

OUTPUT FORMAT (use exactly this structure):
SUBJECT: [subject line here]
---
[newsletter body here]`
}

function buildUserPrompt(profile: UserProfile, chunks: string[]): string {
  const context = chunks.join('\n\n---\n\n')
  return `Write this week's newsletter using the following knowledge from the creator's vault.

KNOWLEDGE CONTEXT:
${context}

Write a newsletter that sounds authentically like them, draws from this specific knowledge, and would genuinely interest their audience of ${profile.target_audience ?? 'readers'}.`
}

function parseDraft(raw: string): DraftResult {
  const subjectMatch = raw.match(/^SUBJECT:\s*(.+)/m)
  const subject = subjectMatch?.[1]?.trim() ?? 'This week from the vault'

  const bodyStart = raw.indexOf('---')
  const contentText = bodyStart > -1
    ? raw.slice(bodyStart + 3).trim()
    : raw.replace(/^SUBJECT:.+\n/m, '').trim()

  const content = contentText
    .split('\n')
    .map(line => line.trim() ? `<p>${line}</p>` : '')
    .join('')

  return { subject, content, contentText }
}
