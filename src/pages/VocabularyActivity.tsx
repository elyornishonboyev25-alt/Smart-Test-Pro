import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gem,
  Keyboard,
  Layers,
  Link2,
  RotateCcw,
  Shuffle,
  Square,
  Sparkles,
  Trophy,
  Volume2,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { vocabularyCollections, type VocabularyEntry } from '@/data/vocabularyCollections'

type ActivityMode = 'flashcards' | 'matching' | 'quiz' | 'typing'

type MatchingRewardState = {
  awardedGroups: number[]
  bonusAwarded: boolean
  completed: boolean
  totalDiamonds: number
  completedAt?: string
}

type MatchingCelebration = {
  amount: number
  reason: string
  total: number
}

const MATCHING_REWARDS_STORAGE_KEY = 'smarttest_vocab_matching_rewards_v2'
const VOCAB_DIAMOND_BANK_STORAGE_KEY = 'smarttest_vocab_diamond_bank_v1'

const CARD_FLIP_TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
const PANEL_TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

const DIAMOND_POSITIONS = [
  { top: '20%', left: '18%', delay: 0.08 },
  { top: '16%', left: '36%', delay: 0.16 },
  { top: '24%', left: '68%', delay: 0.12 },
  { top: '72%', left: '22%', delay: 0.18 },
  { top: '78%', left: '48%', delay: 0.1 },
  { top: '68%', left: '74%', delay: 0.2 },
]

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ')
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function chunkEntries(entries: VocabularyEntry[], size: number) {
  const chunks: VocabularyEntry[][] = []
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size))
  }
  return chunks
}

function playCorrectPing() {
  try {
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, context.currentTime)
    gainNode.gain.setValueAtTime(0.0001, context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18)
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.2)
  } catch {
    // ignore audio errors
  }
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => /en[-_](us|gb|au|ca)/i.test(voice.lang)) ??
    voices.find((voice) => /^en/i.test(voice.lang)) ??
    null
  )
}

function usePronunciation() {
  const [speakingText, setSpeakingText] = useState<string | null>(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setSpeakingText(null)
  }, [isSupported])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const selectedVoice = pickEnglishVoice(window.speechSynthesis.getVoices())
      if (selectedVoice) utterance.voice = selectedVoice
      utterance.lang = selectedVoice?.lang || 'en-US'
      utterance.rate = 0.92
      utterance.pitch = 1
      utterance.onend = () => setSpeakingText(null)
      utterance.onerror = () => setSpeakingText(null)

      setSpeakingText(text)
      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  useEffect(
    () => () => {
      if (!isSupported) return
      window.speechSynthesis.cancel()
    },
    [isSupported],
  )

  return {
    isSupported,
    speakingText,
    speak,
    stop,
  }
}

function getAllMatchingRewardStates(): Record<string, MatchingRewardState> {
  return safeParse<Record<string, MatchingRewardState>>(localStorage.getItem(MATCHING_REWARDS_STORAGE_KEY), {})
}

function saveMatchingRewardState(key: string, state: MatchingRewardState) {
  const allStates = getAllMatchingRewardStates()
  allStates[key] = state
  localStorage.setItem(MATCHING_REWARDS_STORAGE_KEY, JSON.stringify(allStates))
}

function getSectionRewardState(key: string, totalGroups: number): MatchingRewardState {
  const stored = getAllMatchingRewardStates()[key]
  if (!stored) {
    return {
      awardedGroups: [],
      bonusAwarded: false,
      completed: false,
      totalDiamonds: 0,
    }
  }

  const awardedGroups = (stored.awardedGroups ?? [])
    .filter((groupIndex) => Number.isInteger(groupIndex) && groupIndex >= 0 && groupIndex < totalGroups)
    .filter((groupIndex, index, source) => source.indexOf(groupIndex) === index)
    .sort((a, b) => a - b)

  const bonusAwarded = Boolean(stored.bonusAwarded)
  const completed = Boolean(stored.completed || bonusAwarded)
  const baseDiamonds = awardedGroups.length + (bonusAwarded ? 5 : 0)

  return {
    awardedGroups,
    bonusAwarded,
    completed,
    totalDiamonds: Math.max(baseDiamonds, stored.totalDiamonds ?? 0),
    completedAt: stored.completedAt,
  }
}

function getDiamondBank() {
  const raw = Number(localStorage.getItem(VOCAB_DIAMOND_BANK_STORAGE_KEY))
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0
}

function addToDiamondBank(amount: number) {
  const safeAmount = Math.max(0, Math.floor(amount))
  const current = getDiamondBank()
  const next = current + safeAmount
  localStorage.setItem(VOCAB_DIAMOND_BANK_STORAGE_KEY, String(next))
  return next
}

function FlashcardsActivity({ entries }: { entries: VocabularyEntry[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [deck, setDeck] = useState(entries)
  const { isSupported, speakingText, speak, stop } = usePronunciation()
  const current = deck[index]
  const progress = ((index + 1) / deck.length) * 100
  const speakingCurrent = speakingText === current.term

  const nextCard = () => {
    setFlipped(false)
    setIndex((prev) => (prev + 1) % deck.length)
  }

  const previousCard = () => {
    setFlipped(false)
    setIndex((prev) => (prev - 1 + deck.length) % deck.length)
  }

  return (
    <div className="space-y-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-red-100 bg-white p-4 shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Deck Progress</p>
          <p className="text-sm font-semibold text-red-700">Card {index + 1} / {deck.length}</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-red-100">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-orange-500"
          />
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl [perspective:1800px]">
        <motion.button
          onClick={() => setFlipped((value) => !value)}
          whileTap={{ scale: 0.995 }}
          className="relative h-[360px] w-full text-left md:h-[400px]"
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={CARD_FLIP_TRANSITION}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative h-full w-full"
          >
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-white via-red-50/70 to-rose-100/75 p-7 shadow-[0_24px_52px_rgba(244,63,94,0.2)]"
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red-200/45 blur-2xl" />
              <p className="inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
                Term Side
              </p>
              {isSupported ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (speakingCurrent) {
                      stop()
                      return
                    }
                    speak(current.term)
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  {speakingCurrent ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {speakingCurrent ? 'Stop audio' : 'Pronounce'}
                </button>
              ) : null}
              <p className="mt-8 text-4xl font-black leading-tight text-slate-900">{current.term}</p>
              <p className="mt-6 max-w-xl rounded-xl border border-red-100 bg-white/85 px-4 py-3 text-sm leading-6 text-slate-600">
                Tap the card to reveal definition, synonym, and example sentence.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tap to flip</p>
            </div>

            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/75 p-7 shadow-[0_24px_52px_rgba(59,130,246,0.2)]"
            >
              <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-blue-200/45 blur-2xl" />
              <p className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Definition Side
              </p>
              <p className="mt-5 text-xl font-bold leading-8 text-slate-900">{current.definition}</p>
              <p className="mt-4 rounded-xl border border-blue-100 bg-white/90 px-4 py-3 text-sm leading-6 text-slate-700">
                {current.example}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-700">Synonym: {current.synonym}</p>
            </div>
          </motion.div>
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={previousCard}
          className="inline-flex items-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-red-50"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() => {
            setDeck((prev) => shuffle(prev))
            setIndex(0)
            setFlipped(false)
          }}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,63,94,0.35)]"
        >
          <Shuffle className="mr-1 h-4 w-4" />
          Shuffle Deck
        </button>
        <button
          onClick={nextCard}
          className="inline-flex items-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-red-50"
        >
          Next
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function MatchingActivity({
  entries,
  rewardKey,
}: {
  entries: VocabularyEntry[]
  rewardKey: string
}) {
  const groups = useMemo(() => chunkEntries(entries, 7), [entries])
  const definitionGroups = useMemo(() => groups.map((group) => shuffle(group)), [groups])

  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  const [selectedWord, setSelectedWord] = useState<{ groupIndex: number; id: string } | null>(null)
  const [selectedDef, setSelectedDef] = useState<{ groupIndex: number; id: string } | null>(null)
  const [matchedByGroup, setMatchedByGroup] = useState<Record<number, Record<string, boolean>>>({})
  const [completedGroups, setCompletedGroups] = useState<Record<number, boolean>>({})
  const [wrongPair, setWrongPair] = useState<{ groupIndex: number; wordId: string; defId: string } | null>(null)
  const [sectionReward, setSectionReward] = useState<MatchingRewardState>(() => getSectionRewardState(rewardKey, groups.length))
  const [diamondBank, setDiamondBank] = useState<number>(() => getDiamondBank())
  const [celebration, setCelebration] = useState<MatchingCelebration | null>(null)

  const completedGroupsRef = useRef<Record<number, boolean>>({})
  const sectionRewardRef = useRef(sectionReward)

  useEffect(() => {
    const nextReward = getSectionRewardState(rewardKey, groups.length)
    setSectionReward(nextReward)
    sectionRewardRef.current = nextReward
    setDiamondBank(getDiamondBank())
    setActiveGroupIndex(0)
    setSelectedWord(null)
    setSelectedDef(null)
    setMatchedByGroup({})
    setCompletedGroups({})
    completedGroupsRef.current = {}
    setWrongPair(null)
    setCelebration(null)
  }, [rewardKey, groups.length])

  useEffect(() => {
    sectionRewardRef.current = sectionReward
  }, [sectionReward])

  useEffect(() => {
    completedGroupsRef.current = completedGroups
  }, [completedGroups])

  useEffect(() => {
    if (!celebration) return
    const timer = window.setTimeout(() => setCelebration(null), 2200)
    return () => window.clearTimeout(timer)
  }, [celebration])

  const commitRewardState = useCallback(
    (nextState: MatchingRewardState, diamondsEarned: number, reason: string) => {
      sectionRewardRef.current = nextState
      setSectionReward(nextState)
      saveMatchingRewardState(rewardKey, nextState)

      if (diamondsEarned > 0) {
        const nextBank = addToDiamondBank(diamondsEarned)
        setDiamondBank(nextBank)
        setCelebration({
          amount: diamondsEarned,
          reason,
          total: nextBank,
        })
      }
    },
    [rewardKey],
  )

  const onGroupCompleted = useCallback(
    (groupIndex: number) => {
      const currentReward = sectionRewardRef.current

      let nextReward = currentReward
      let diamondsEarned = 0
      let reason = `Group ${groupIndex + 1} completed`

      if (!currentReward.completed && !currentReward.awardedGroups.includes(groupIndex)) {
        const awardedGroups = [...currentReward.awardedGroups, groupIndex].sort((a, b) => a - b)
        nextReward = {
          ...currentReward,
          awardedGroups,
          totalDiamonds: currentReward.totalDiamonds + 1,
        }
        diamondsEarned += 1
      }

      const hasAllGroupRewards = groups.every((_, index) => nextReward.awardedGroups.includes(index))
      if (hasAllGroupRewards && !nextReward.bonusAwarded) {
        nextReward = {
          ...nextReward,
          bonusAwarded: true,
          completed: true,
          totalDiamonds: nextReward.totalDiamonds + 5,
          completedAt: new Date().toISOString(),
        }
        diamondsEarned += 5
        reason = `All groups completed bonus`
      }

      if (nextReward !== currentReward) {
        commitRewardState(nextReward, diamondsEarned, reason)
      }
    },
    [commitRewardState, groups],
  )

  const onTryMatch = (groupIndex: number, wordId: string, defId: string) => {
    if (wordId === defId) {
      let groupSolvedNow = false
      setMatchedByGroup((prev) => {
        const previousGroupMatches = prev[groupIndex] ?? {}
        if (previousGroupMatches[wordId]) {
          return prev
        }
        const nextGroupMatches = { ...previousGroupMatches, [wordId]: true }
        groupSolvedNow = groups[groupIndex].every((item) => nextGroupMatches[item.id])
        return { ...prev, [groupIndex]: nextGroupMatches }
      })

      setWrongPair(null)
      playCorrectPing()

      if (groupSolvedNow && !completedGroupsRef.current[groupIndex]) {
        const nextCompletedGroups = { ...completedGroupsRef.current, [groupIndex]: true }
        completedGroupsRef.current = nextCompletedGroups
        setCompletedGroups(nextCompletedGroups)
        onGroupCompleted(groupIndex)

        const nextOpenGroup = groups.findIndex((_, index) => !nextCompletedGroups[index])
        if (nextOpenGroup !== -1) setActiveGroupIndex(nextOpenGroup)
      }
    } else {
      setWrongPair({ groupIndex, wordId, defId })
      window.setTimeout(() => {
        setWrongPair((previous) =>
          previous?.groupIndex === groupIndex && previous.wordId === wordId && previous.defId === defId ? null : previous,
        )
      }, 500)
    }

    setSelectedWord(null)
    setSelectedDef(null)
  }

  const onPickWord = (groupIndex: number, wordId: string) => {
    if (matchedByGroup[groupIndex]?.[wordId]) return
    if (selectedDef && selectedDef.groupIndex === groupIndex) {
      onTryMatch(groupIndex, wordId, selectedDef.id)
      return
    }
    setSelectedWord({ groupIndex, id: wordId })
  }

  const onPickDefinition = (groupIndex: number, defId: string) => {
    if (matchedByGroup[groupIndex]?.[defId]) return
    if (selectedWord && selectedWord.groupIndex === groupIndex) {
      onTryMatch(groupIndex, selectedWord.id, defId)
      return
    }
    setSelectedDef({ groupIndex, id: defId })
  }

  const replayMode = sectionReward.completed
  const completedCount = Object.values(completedGroups).filter(Boolean).length
  const activeGroup = groups[activeGroupIndex] ?? []
  const activeDefinitions = definitionGroups[activeGroupIndex] ?? []
  const activeMatches = matchedByGroup[activeGroupIndex] ?? {}
  const activeMatchedCount = activeGroup.filter((item) => activeMatches[item.id]).length
  const allGroupsCompletedInSession = completedCount === groups.length && groups.length > 0

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-rose-100/45 p-4 shadow-[0_16px_34px_rgba(244,63,94,0.14)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">Matching Rewards</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Group completion: +1 diamond each. All groups completed: +5 extra diamonds.
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-white px-3 py-2 text-right shadow-sm">
            <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
              <Gem className="h-3.5 w-3.5" />
              Diamond Wallet
            </p>
            <p className="text-2xl font-black text-slate-900">{diamondBank}</p>
          </div>
        </div>

        {replayMode ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Gem className="h-4 w-4" />
              You have already completed this passage and collected all diamond rewards.
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              Replay mode is active. You can still practice all groups, but no extra diamonds will be awarded.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-700">
            Rewards earned here: <span className="font-bold text-red-700">{sectionReward.totalDiamonds}</span> diamonds
          </div>
        )}
      </section>

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group, index) => {
          const sessionCompleted = Boolean(completedGroups[index])
          const alreadyRewarded = sectionReward.awardedGroups.includes(index)
          const isActive = activeGroupIndex === index
          return (
            <button
              key={`group_${index + 1}`}
              onClick={() => setActiveGroupIndex(index)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-red-400 bg-red-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-red-300'
              }`}
            >
              <p className="text-sm font-bold text-slate-900">Group {index + 1}</p>
              <p className="text-xs text-slate-500">{group.length} terms</p>
              <p
                className={`mt-2 text-xs font-semibold ${
                  sessionCompleted
                    ? 'text-green-600'
                    : alreadyRewarded
                      ? 'text-amber-600'
                      : 'text-slate-500'
                }`}
              >
                {sessionCompleted ? 'Completed in this run' : alreadyRewarded ? 'Reward already claimed' : 'Ready'}
              </p>
            </button>
          )
        })}
      </section>

      <section className="rounded-2xl border border-red-100 bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-black text-slate-900">Group {activeGroupIndex + 1} Matching Board</h3>
            <p className="text-sm text-slate-600">
              Match every term with its correct definition.
            </p>
          </div>
          <div className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
            {activeMatchedCount} / {activeGroup.length} matched
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {activeGroup.map((item) => (
              <button
                key={item.id}
                onClick={() => onPickWord(activeGroupIndex, item.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  activeMatches[item.id]
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : wrongPair?.groupIndex === activeGroupIndex && wrongPair.wordId === item.id
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : selectedWord?.groupIndex === activeGroupIndex && selectedWord.id === item.id
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-slate-50 hover:border-red-300'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {activeMatches[item.id] ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {item.term}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {activeDefinitions.map((item) => (
              <button
                key={`def_${item.id}`}
                onClick={() => onPickDefinition(activeGroupIndex, item.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  activeMatches[item.id]
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : wrongPair?.groupIndex === activeGroupIndex && wrongPair.defId === item.id
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : selectedDef?.groupIndex === activeGroupIndex && selectedDef.id === item.id
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 bg-slate-50 hover:border-red-300'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {activeMatches[item.id] ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {item.definition}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {allGroupsCompletedInSession ? (
        <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-[0_12px_30px_rgba(245,158,11,0.2)]">
          <p className="inline-flex items-center gap-2 text-lg font-black text-amber-700">
            <Trophy className="h-5 w-5" />
            All matching groups completed
          </p>
          <p className="mt-2 text-sm text-amber-800">
            {replayMode
              ? 'Replay complete. Rewards were already collected earlier.'
              : 'Excellent work. Group rewards and final bonus are now applied.'}
          </p>
        </section>
      ) : null}

      <AnimatePresence>
        {celebration ? (
          <motion.div
            key="diamond_celebration"
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />

            {DIAMOND_POSITIONS.map((position, index) => (
              <motion.div
                key={`fx_${index + 1}`}
                className="absolute text-red-200"
                style={{ top: position.top, left: position.left }}
                initial={{ opacity: 0, y: 16, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  y: [-4, -40, -70],
                  scale: [0.4, 1, 0.8],
                  rotate: [0, 18, -8],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: position.delay, ease: 'easeOut' }}
              >
                <Gem className="h-8 w-8" />
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={PANEL_TRANSITION}
              className="relative overflow-hidden rounded-[1.8rem] border border-red-200 bg-gradient-to-br from-white via-red-50 to-rose-100 px-8 py-7 text-center shadow-[0_24px_62px_rgba(244,63,94,0.35)]"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-200/55 blur-2xl" />
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-red-700">
                <Sparkles className="h-4 w-4" />
                Diamond Reward
              </p>
              <p className="mt-2 text-4xl font-black text-slate-900">+{celebration.amount}</p>
              <p className="mt-2 text-sm font-semibold text-red-700">{celebration.reason}</p>
              <p className="mt-2 text-sm text-slate-600">Total diamonds in wallet: {celebration.total}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function QuizActivity({ entries }: { entries: VocabularyEntry[] }) {
  const questions = useMemo(() => entries.slice(0, 10), [entries])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const { isSupported, speakingText, speak, stop } = usePronunciation()
  const current = questions[index]
  const speakingCurrent = speakingText === current.term

  const options = useMemo(() => {
    const wrong = shuffle(entries.filter((item) => item.id !== current.id))
      .slice(0, 3)
      .map((item) => item.definition)
    return shuffle([current.definition, ...wrong])
  }, [entries, current])

  const next = () => {
    if (!selected) return
    setAnswers((prev) => ({ ...prev, [current.id]: selected }))
    setSelected(null)
    if (index === questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex((prev) => prev + 1)
  }

  const evaluated = finished
    ? questions.map((question) => {
      const answer = answers[question.id]
      return { question, answer, correct: answer === question.definition }
    })
    : []

  const score = evaluated.filter((row) => row.correct).length

  if (finished) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-red-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <h3 className="text-3xl font-bold text-slate-900">Quiz Complete!</h3>
        <p className="mt-2 text-lg text-red-700">You got {score} out of {questions.length} correct.</p>
        <div className="mt-5 max-h-72 space-y-2 overflow-y-auto pr-1">
          {evaluated.filter((row) => !row.correct).map((row) => (
            <div key={row.question.id} className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-semibold">{row.question.term}</p>
              <p>Your answer: {row.answer ?? 'No answer'}</p>
              <p>Correct: {row.question.definition}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-red-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="mb-4 h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold text-slate-900">What is the best definition of "{current.term}"?</h3>
        {isSupported ? (
          <button
            type="button"
            onClick={() => {
              if (speakingCurrent) {
                stop()
                return
              }
              speak(current.term)
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            {speakingCurrent ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {speakingCurrent ? 'Stop' : 'Pronounce'}
          </button>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selected === option ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 hover:border-red-300'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">Question {index + 1} / {questions.length}</p>
        <button
          onClick={next}
          disabled={!selected}
          className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}

function TypingActivity({ entries }: { entries: VocabularyEntry[] }) {
  const questions = useMemo(() => entries.slice(0, 10), [entries])
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const current = questions[index]

  const next = () => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
    setValue('')
    if (index === questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex((prev) => prev + 1)
  }

  const result = finished
    ? questions.map((question) => {
      const answer = answers[question.id] ?? ''
      return { question, answer, correct: normalize(answer) === normalize(question.term) }
    })
    : []

  const score = result.filter((row) => row.correct).length

  if (finished) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-red-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <h3 className="text-3xl font-bold text-slate-900">Typing Complete!</h3>
        <p className="mt-2 text-lg text-red-700">Accuracy: {score}/{questions.length}</p>
        <div className="mt-5 max-h-72 space-y-2 overflow-y-auto pr-1">
          {result.filter((row) => !row.correct).map((row) => (
            <div key={row.question.id} className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
              <p className="font-semibold text-slate-900">{row.question.definition}</p>
              <p className="text-red-700">Your input: {row.answer || '-'}</p>
              <p className="text-green-700">Correct: {row.question.term}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-red-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="mb-4 h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className="text-2xl font-semibold text-slate-900">Type the term for this definition:</h3>
      <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-red-700">{current.definition}</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type the word or phrase..."
        className="mt-4 w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
      />
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">Question {index + 1} / {questions.length}</p>
        <button onClick={next} className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white">Next</button>
      </div>
    </section>
  )
}

function findSelection(params: {
  bookId?: string
  testId?: string
  sectionId?: string
  packId?: string
}) {
  if (params.bookId && params.testId && params.sectionId) {
    const book = vocabularyCollections.ielts.find((item) => item.id === params.bookId)
    if (!book) return null
    const test = book.tests.find((item) => item.id === params.testId)
    if (!test) return null
    if (test.available === false) return null
    const section = test.sections.find((item) => item.id === params.sectionId)
    if (!section) return null
    return {
      title: `${book.title} - ${test.title} - ${section.title}`,
      section,
      basePath: `/vocabulary/ielts/${book.id}/${test.id}/${section.id}`,
      trackPath: '/vocabulary/ielts',
      rewardKey: `ielts:${book.id}:${test.id}:${section.id}`,
    }
  }

  if (params.packId && params.sectionId) {
    const pack = vocabularyCollections.sat.find((item) => item.id === params.packId)
    if (!pack) return null
    const section = pack.sections.find((item) => item.id === params.sectionId)
    if (!section) return null
    return {
      title: `${pack.title} - ${section.title}`,
      section,
      basePath: `/vocabulary/sat/${pack.id}/${section.id}`,
      trackPath: '/vocabulary/sat',
      rewardKey: `sat:${pack.id}:${section.id}`,
    }
  }

  return null
}

function resolveActivity(activity?: string): ActivityMode | null {
  if (!activity) return null
  if (activity === 'flashcards' || activity === 'matching' || activity === 'quiz' || activity === 'typing') {
    return activity
  }
  return null
}

export default function VocabularyActivity() {
  const params = useParams()
  const activity = resolveActivity(params.activity)
  const selection = findSelection(params)

  if (!selection) return <Navigate to="/vocabulary" replace />
  if (params.activity && !activity) return <Navigate to={selection.basePath} replace />

  const { title, section, basePath, trackPath, rewardKey } = selection
  const entries: VocabularyEntry[] = section.entries
  const isSatTrack = trackPath.includes('/sat')
  const backButtonClass = isSatTrack ? 'premium-back-btn-sm-blue' : 'premium-back-btn-sm'
  const trackChipClass = isSatTrack ? 'premium-top-chip-blue' : 'premium-top-chip'
  const trackChipLabel = isSatTrack ? 'SAT Vocabulary Track' : 'IELTS Vocabulary Track'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff8f8] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-14 top-8 h-72 w-72 rounded-full bg-red-200/45 blur-3xl" />
        <div className="absolute right-[-8rem] top-20 h-[22rem] w-[22rem] rounded-full bg-rose-200/35 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-red-100 bg-white/90 p-5 shadow-[0_24px_54px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                <Sparkles className="h-3.5 w-3.5" />
                Vocabulary Selection
              </p>
              <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{title}</h3>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-white px-3 py-1 text-sm font-semibold text-red-700 shadow-sm">
              {entries.length} terms
            </div>
          </div>

          {!activity ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="premium-top-controls">
                  <Link to={trackPath} className={`${backButtonClass} group`}>
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    Back
                  </Link>
                  <span className={`${trackChipClass} gap-1`}>
                    <Sparkles className="h-3.5 w-3.5" />
                    {trackChipLabel}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-white p-4">
                <h4 className="text-2xl font-black text-slate-900">Choose an Activity</h4>
                <p className="mt-1 text-sm text-slate-600">
                  Focused vocabulary practice with live pronunciation, quiz validation, matching, and typing drills.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to={`${basePath}/flashcards`} className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <Layers className="mb-2 h-5 w-5 text-red-700" />
                  <h4 className="text-lg font-bold text-slate-900">Flashcards</h4>
                  <p className="text-sm text-slate-600">Premium 3D flip cards with strong visual feedback.</p>
                </Link>
                <Link to={`${basePath}/matching`} className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <Link2 className="mb-2 h-5 w-5 text-red-700" />
                  <h4 className="text-lg font-bold text-slate-900">Matching Game</h4>
                  <p className="text-sm text-slate-600">7-term group battles + diamond rewards and celebration.</p>
                </Link>
                <Link to={`${basePath}/quiz`} className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <CheckCircle2 className="mb-2 h-5 w-5 text-red-700" />
                  <h4 className="text-lg font-bold text-slate-900">Quiz</h4>
                  <p className="text-sm text-slate-600">Quick validation with instant score review.</p>
                </Link>
                <Link to={`${basePath}/typing`} className="rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <Keyboard className="mb-2 h-5 w-5 text-red-700" />
                  <h4 className="text-lg font-bold text-slate-900">Typing Practice</h4>
                  <p className="text-sm text-slate-600">Accuracy training to lock spelling and recall.</p>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xl font-bold text-slate-900">
                  {activity === 'flashcards'
                    ? 'Flashcards'
                    : activity === 'matching'
                      ? 'Matching Game'
                      : activity === 'quiz'
                        ? 'Quiz'
                        : 'Typing Practice'}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={basePath}
                    className={backButtonClass}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Activities
                  </Link>
                  <Link
                    to={trackPath}
                    className={backButtonClass}
                  >
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Track
                  </Link>
                </div>
              </div>

              {activity === 'flashcards' ? <FlashcardsActivity entries={entries} /> : null}
              {activity === 'matching' ? <MatchingActivity entries={entries} rewardKey={rewardKey} /> : null}
              {activity === 'quiz' ? <QuizActivity entries={entries} /> : null}
              {activity === 'typing' ? <TypingActivity entries={entries} /> : null}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

