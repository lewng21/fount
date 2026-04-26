import Anthropic from '@anthropic-ai/sdk'
import type { Draft, VoiceProfile } from './writer-agent'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function runEditorAgent(draft: Draft, profile: VoiceProfile): Promise<Draft> {
  if (!profile.sample_sentences?.trim()) return draft

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: `You are a copy editor ensuring a newsletter sounds authentic to its author.
Fix any passages that sound like generic AI writing and make them match the author's voice.
Do not change facts, structure, or the call to action. Only improve voice authenticity.
Return only the refined newsletter body — no subject line, no explanation.`,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `AUTHOR'S VOICE SAMPLES:
${profile.sample_sentences}

DRAFT TO REFINE:
${draft.contentText}`,
      },
    ],
  })

  const refined = response.content[0].type === 'text' ? response.content[0].text.trim() : draft.contentText
  const content = refined
    .split('\n')
    .map(l => (l.trim() ? `<p>${l}</p>` : ''))
    .join('')
  return { ...draft, content, contentText: refined }
}
