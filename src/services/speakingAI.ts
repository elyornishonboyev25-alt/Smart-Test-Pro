// AI examiner brain. Reuses the Gemini key-rotation layer from geminiAI.ts so it
// inherits the same multi-key / multi-model fallback (never blocked by quota).
//   - getExaminerReply(): the adaptive follow-up engine (Features 3 & 4).
//   - evaluateSpeaking(): IELTS band scoring across the 4 official criteria (Feature 6).

import { callGeminiAPI, extractJSON } from './geminiAI'
import type { SpeechStats } from '@/lib/speakingScoring'
import { estimateBandsFromStats } from '@/lib/speakingScoring'

export type ExaminerTurn = {
  role: 'examiner' | 'candidate'
  text: string
}

export type ExaminerDirective = 'follow_up' | 'transition' | 'closing'

export type ExaminerReplyParams = {
  /** 1 | 2 | 3 for IELTS, or 0 for a non-IELTS interview persona. */
  part: 0 | 1 | 2 | 3
  /** Examiner persona — defaults to a British IELTS examiner. */
  persona?: string
  history: ExaminerTurn[]
  directive: ExaminerDirective
  /** Topic/question to steer a transition to a fresh area. */
  seedQuestion?: string
  candidateName?: string
}

function buildExaminerSystemPrompt(persona: string): string {
  return `You are ${persona}. You are conducting a live spoken English assessment with a single candidate. You behave like a REAL human examiner, not a chatbot.

VOICE & MANNER:
- Warm, calm, professional. British English. Speak naturally, as if face to face.
- Ask ONE question at a time. Keep each turn SHORT (1–2 sentences, max ~35 words) because it will be read aloud.
- NEVER give feedback, scores, corrections, or praise about their English during the test. Stay in role as the examiner.
- Use the candidate's own words to ask genuine, adaptive follow-ups (e.g. they say "I play football" → "What position do you play, and why?").
- Remember everything said earlier in the conversation and occasionally refer back to it ("You mentioned earlier that…").
- Do not number your questions or say "Question 1". Just ask, like a person.
- No markdown, no emojis, no stage directions. Output ONLY the words you would say aloud.

DIRECTIVES:
- follow_up: dig deeper into the candidate's LAST answer with a natural, specific follow-up question.
- transition: smoothly move to a new topic. A seed topic/question may be provided — rephrase it in your own natural words.
- closing: politely close the current part or the whole test in one short, friendly sentence (e.g. "Thank you, that's the end of this part.").

RESPONSE FORMAT — return ONLY valid JSON, nothing else:
{ "reply": "<exactly what you say aloud>" }`
}

const DEFAULT_PERSONA = 'a friendly, experienced British IELTS speaking examiner'

function historyToText(history: ExaminerTurn[], candidateName?: string): string {
  const who = candidateName?.trim() || 'Candidate'
  return history
    .slice(-12)
    .map((t) => `${t.role === 'examiner' ? 'Examiner' : who}: ${t.text}`)
    .join('\n')
}

/** Generate the examiner's next spoken line. Falls back to a scripted line on error. */
export async function getExaminerReply(params: ExaminerReplyParams): Promise<string> {
  const persona = params.persona ?? DEFAULT_PERSONA
  const system = buildExaminerSystemPrompt(persona)

  const partLabel =
    params.part === 0 ? 'Interview' : `IELTS Speaking Part ${params.part}`
  const directiveLine =
    params.directive === 'follow_up'
      ? 'Ask a natural follow-up question about the candidate’s last answer.'
      : params.directive === 'transition'
        ? `Move to a new topic.${params.seedQuestion ? ` Base it on this idea: "${params.seedQuestion}"` : ''}`
        : 'Politely close this part in one short sentence.'

  const userMessage = `CONTEXT: ${partLabel}.
${directiveLine}

Conversation so far:
${historyToText(params.history, params.candidateName) || '(the test is just starting)'}

Respond with JSON only: { "reply": "<what you say next>" }`

  try {
    const raw = await callGeminiAPI(system, userMessage, 256)
    const parsed = JSON.parse(extractJSON(raw)) as { reply?: string }
    const reply = (parsed.reply ?? '').trim()
    if (reply) return reply
  } catch {
    // fall through to scripted fallback
  }
  return fallbackExaminerLine(params)
}

function fallbackExaminerLine(params: ExaminerReplyParams): string {
  if (params.directive === 'closing') return 'Thank you. That brings us to the end of this part.'
  if (params.directive === 'transition' && params.seedQuestion) return params.seedQuestion
  const generic = [
    'That’s interesting — could you tell me a little more about that?',
    'Why do you think that is?',
    'Can you give me an example?',
    'How did that make you feel?',
  ]
  return generic[Math.floor(Math.random() * generic.length)]
}

// ── Band scoring ────────────────────────────────────────────────────────────
export type SpeakingEvaluation = {
  overallBand: number
  fluencyBand: number
  lexicalBand: number
  grammarBand: number
  pronunciationBand: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  improvementPriorities: Array<{ area: string; target: number; action: string }>
  stats: SpeechStats
  source: 'ai' | 'offline'
}

const EVALUATION_PROMPT = `You are a senior, certified IELTS Speaking examiner with 15+ years of experience. You apply the official IELTS Speaking band descriptors with real-exam rigour and fairness. Pronunciation must be judged ONLY from the transcript's evidence (rhythm, sentence flow, fillers) since you cannot hear audio — estimate conservatively and say so if uncertain.

TASK: Evaluate the candidate's spoken responses. Return a SINGLE valid JSON object and NOTHING else.

SCORE EACH CRITERION 0.0–9.0 in 0.5 steps:
1) fluencyBand — Fluency & Coherence: flow, hesitation, fillers, logical development, linking.
2) lexicalBand — Lexical Resource: range, precision, collocation, paraphrase, idiomatic language.
3) grammarBand — Grammatical Range & Accuracy: variety of structures, accuracy, error density.
4) pronunciationBand — Pronunciation: estimated from rhythm, chunking and filler load (be cautious; anchor near fluency).

SCORING DISCIPLINE:
- Be realistic: most genuine attempts land 5.0–6.5. Award 7.0+ only for clearly strong, well-developed answers; 8.0+ only for near-native control. Very short or off-topic answers must score low (≤4.5).
- overallBand = average of the 4 criteria, rounded to the nearest 0.5.

FEEDBACK:
- summary: 2–3 honest sentences naming the single biggest lever to raise the band.
- strengths: 3 specific things they did well (reference what they actually said).
- weaknesses: 3 specific, concrete problems (not generic).
- improvementPriorities: 3 items, each { "area": <criterion>, "target": <achievable next band as number>, "action": <one concrete practice step> }.

RESPONSE FORMAT (strict JSON, no markdown):
{
  "fluencyBand": <number>,
  "lexicalBand": <number>,
  "grammarBand": <number>,
  "pronunciationBand": <number>,
  "overallBand": <number>,
  "summary": "<2-3 sentences>",
  "strengths": ["<...>", "<...>", "<...>"],
  "weaknesses": ["<...>", "<...>", "<...>"],
  "improvementPriorities": [
    { "area": "<criterion>", "target": <number>, "action": "<step>" }
  ]
}`

function clampBand(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 5
  return Math.round(Math.max(2, Math.min(9, num)) * 2) / 2
}

export type EvaluateParams = {
  modeLabel: string
  history: ExaminerTurn[]
  stats: SpeechStats
}

export async function evaluateSpeaking(params: EvaluateParams): Promise<SpeakingEvaluation> {
  const transcript = params.history
    .map((t) => `${t.role === 'examiner' ? 'Examiner' : 'Candidate'}: ${t.text}`)
    .join('\n')

  const userMessage = `ASSESSMENT TYPE: ${params.modeLabel}

OBJECTIVE SPEECH STATS (from automatic analysis):
- Total words spoken: ${params.stats.wordCount}
- Distinct words: ${params.stats.uniqueWords} (lexical variety ${(params.stats.typeTokenRatio * 100).toFixed(0)}%)
- Filler words: ${params.stats.fillerCount}${params.stats.fillerWords.length ? ` (${params.stats.fillerWords.join(', ')})` : ''}
- Speaking pace: ${params.stats.wordsPerMinute} words/min over ${params.stats.durationSec}s

FULL TRANSCRIPT (examiner questions + candidate answers):
${transcript}

Grade the CANDIDATE's spoken English now. Return ONLY valid JSON.`

  try {
    const raw = await callGeminiAPI(EVALUATION_PROMPT, userMessage, 2048)
    const parsed = JSON.parse(extractJSON(raw)) as Partial<SpeakingEvaluation>
    const fluencyBand = clampBand(parsed.fluencyBand)
    const lexicalBand = clampBand(parsed.lexicalBand)
    const grammarBand = clampBand(parsed.grammarBand)
    const pronunciationBand = clampBand(parsed.pronunciationBand)
    const overallBand = parsed.overallBand
      ? clampBand(parsed.overallBand)
      : clampBand((fluencyBand + lexicalBand + grammarBand + pronunciationBand) / 4)

    return {
      fluencyBand,
      lexicalBand,
      grammarBand,
      pronunciationBand,
      overallBand,
      summary: parsed.summary?.trim() || 'Evaluation complete.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 4) : [],
      improvementPriorities: Array.isArray(parsed.improvementPriorities)
        ? parsed.improvementPriorities
            .filter((p) => p && p.area && p.action)
            .slice(0, 4)
            .map((p) => ({ area: String(p.area), target: clampBand(p.target), action: String(p.action) }))
        : [],
      stats: params.stats,
      source: 'ai',
    }
  } catch {
    // AI unreachable (e.g. quota) — return an offline heuristic so a result still shows.
    return offlineEvaluation(params)
  }
}

function offlineEvaluation(params: EvaluateParams): SpeakingEvaluation {
  const bands = estimateBandsFromStats(params.stats)
  const { wordCount, fillerCount, wordsPerMinute } = params.stats
  const weaknesses: string[] = []
  if (fillerCount > 4) weaknesses.push(`Reduce filler words — you used ${fillerCount}. Pause silently instead.`)
  if (wordCount < 60) weaknesses.push('Develop answers further — extend each idea with a reason and an example.')
  if (wordsPerMinute && (wordsPerMinute < 80 || wordsPerMinute > 180))
    weaknesses.push('Aim for a steady, natural pace of roughly 110–150 words per minute.')
  if (weaknesses.length === 0) weaknesses.push('Use a wider range of complex sentences and topic-specific vocabulary.')

  return {
    ...bands,
    summary:
      'Offline estimate (AI grading was unavailable). Scores are approximate, based on your fluency, pace and vocabulary range. Try again shortly for a full AI assessment.',
    strengths: [
      wordCount >= 60 ? 'You produced a good amount of speech.' : 'You attempted the full answer.',
      params.stats.typeTokenRatio >= 0.5 ? 'Reasonable vocabulary variety.' : 'Clear, understandable ideas.',
    ],
    weaknesses: weaknesses.slice(0, 3),
    improvementPriorities: [
      { area: 'Fluency & Coherence', target: clampBand(bands.fluencyBand + 0.5), action: 'Practise speaking for 2 minutes without stopping on one topic.' },
      { area: 'Lexical Resource', target: clampBand(bands.lexicalBand + 0.5), action: 'Learn 5 topic phrases daily and use them when you speak.' },
    ],
    stats: params.stats,
    source: 'offline',
  }
}
