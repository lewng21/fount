import Anthropic from '@anthropic-ai/sdk'
import { retrieveRelevantChunks } from '@/lib/rag'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export type ResearchSummary = {
  text: string
  queriesRun: string[]
  chunksFound: number
}

const searchTool: Anthropic.Tool = {
  name: 'search_knowledge_base',
  description:
    "Search the user's knowledge vault for relevant content. Call this 3-5 times with different queries to gather diverse material from multiple angles.",
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Specific search query to find relevant content' },
    },
    required: ['query'],
  },
}

export async function runResearchAgent(
  userId: string,
  niche: string,
  audience: string,
  goal: string,
): Promise<ResearchSummary> {
  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `You are a research agent preparing material for a newsletter.

NEWSLETTER CONTEXT:
- Niche: ${niche}
- Audience: ${audience}
- Goal: ${goal}

Search the knowledge base 3-5 times using different queries. Think about what topics, insights, or stories would genuinely interest this audience. Vary your search angles — try broad topic searches, specific subtopic searches, and searches for actionable advice or recent notes.

After searching, write a concise RESEARCH SUMMARY with:
1. The most compelling content you found
2. A recommended newsletter hook or angle
3. Specific facts, insights, or quotes worth including

Start searching now.`,
    },
  ]

  const queriesRun: string[] = []
  let chunksFound = 0

  while (true) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      tools: [searchTool],
      messages,
    })

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason === 'end_turn') {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map(b => b.text)
        .join('\n')
      return { text, queriesRun, chunksFound }
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = []
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue
      const { query } = block.input as { query: string }
      queriesRun.push(query)

      const chunks = await retrieveRelevantChunks(userId, query, 8)
      chunksFound += chunks.length

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content:
          chunks.length > 0
            ? chunks.map((c, i) => `[${i + 1}] ${c.content}`).join('\n\n')
            : 'No relevant content found for this query.',
      })
    }

    messages.push({ role: 'user', content: toolResults })
  }
}
