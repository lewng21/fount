import { runResearchAgent } from './research-agent'
import { runWriterAgent, type VoiceProfile, type Draft } from './writer-agent'
import { runEditorAgent } from './editor-agent'

export type PipelineResult = {
  draft: Draft
  agentTrace: {
    queriesRun: string[]
    chunksFound: number
  }
}

export async function runNewsletterPipeline(
  userId: string,
  profile: VoiceProfile,
): Promise<PipelineResult> {
  const research = await runResearchAgent(
    userId,
    profile.niche ?? '',
    profile.target_audience ?? 'general audience',
    profile.newsletter_goal ?? 'educate and engage',
  )

  const rawDraft = await runWriterAgent(research, profile)
  const finalDraft = await runEditorAgent(rawDraft, profile)

  return {
    draft: finalDraft,
    agentTrace: {
      queriesRun: research.queriesRun,
      chunksFound: research.chunksFound,
    },
  }
}
