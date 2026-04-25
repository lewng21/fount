import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { VoyageAIClient } = require('voyageai')

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY! })

const MODEL = 'voyage-3-lite'
const BATCH_SIZE = 128

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)
    const response = await client.embed({ input: batch, model: MODEL })
    for (const item of response.data ?? []) {
      embeddings.push(item.embedding as number[])
    }
  }

  return embeddings
}

export async function embedQuery(text: string): Promise<number[]> {
  const response = await client.embed({ input: [text], model: MODEL })
  return (response.data?.[0]?.embedding as number[]) ?? []
}
