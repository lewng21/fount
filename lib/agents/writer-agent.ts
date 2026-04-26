import Anthropic from '@anthropic-ai/sdk'
import type { ResearchSummary } from './research-agent'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export type VoiceProfile = {
  display_name?: string | null
  niche?: string | null
  target_audience?: string | null
  tone?: string | null
  sample_sentences?: string | null
  newsletter_goal?: string | null
}

export type Draft = {
  subject: string
  content: string
  contentText: string
}

export async function runWriterAgent(research: ResearchSummary, profile: VoiceProfile): Promise<Draft> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: buildSystem(profile),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildPrompt(research, profile) }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  return parseDraft(raw)
}

function buildSystem(p: VoiceProfile): string {
  return `You are a ghostwriter for ${p.display_name ?? 'a creator'}.

Write their newsletter exactly as they would — not generic AI copy.

THEIR NICHE: ${p.niche ?? 'not specified'}
THEIR AUDIENCE: ${p.target_audience ?? 'not specified'}
THEIR TONE: ${p.tone ?? 'conversational'}
THEIR GOAL: ${p.newsletter_goal ?? 'educate and engage'}

${
  p.sample_sentences
    ? `VOICE EXAMPLES — match this style precisely:
${p.sample_sentences}`
    : ''
}

RULES:
- Write in first person, sounds like a human expert
- 350-550 words
- Use specific details from the research — never invent facts
- Include one clear call to action
- Write a compelling subject line

OUTPUT FORMAT (use exactly):
SUBJECT: [subject line]
---
[newsletter body]`
}

function buildPrompt(research: ResearchSummary, p: VoiceProfile): string {
  return `Write this week's newsletter using the research below.

RESEARCH FINDINGS:
${research.text}

Write a newsletter that sounds authentically like ${p.display_name ?? 'the author'} and would genuinely interest ${p.target_audience ?? 'readers'}.`
}

function parseDraft(raw: string): Draft {
  const subjectMatch = raw.match(/^SUBJECT:\s*(.+)/m)
  const subject = subjectMatch?.[1]?.trim() ?? 'This week from the vault'
  const bodyStart = raw.indexOf('---')
  const contentText =
    bodyStart > -1 ? raw.slice(bodyStart + 3).trim() : raw.replace(/^SUBJECT:.+\n/m, '').trim()
  const content = contentText
    .split('\n')
    .map(l => (l.trim() ? `<p>${l}</p>` : ''))
    .join('')
  return { subject, content, contentText }
}
