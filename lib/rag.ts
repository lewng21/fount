import { createClient } from '@supabase/supabase-js'
import { embedQuery } from './embeddings'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type RetrievedChunk = {
  id: string
  content: string
  file_id: string
  similarity: number
}

export async function retrieveRelevantChunks(
  userId: string,
  query: string,
  topK = 15
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedQuery(query)

  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_count: topK,
  })

  if (error) throw new Error(`RAG retrieval failed: ${error.message}`)
  return (data ?? []) as RetrievedChunk[]
}
