import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Timer from '../components/Timer'
import QuestionPanel from '../components/QuestionPanel'
import Controls from '../components/Controls'
import { useAuth } from '../context/AuthContext'
import { useSession } from '../context/SessionContext'
import useTimer from '../hooks/useTimer'
import { finalizeSessionState, saveSession } from '../utils/sessionHistory'
import JumpingMascots from '../components/JumpingMascots'
import SessionAmbientArt from '../components/SessionAmbientArt'

function formatMmSs(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

export default function SessionPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { state, dispatch } = useSession()
  const {
    sessionName,
    totalQuestions,
    currentQuestion,
    timePerQuestion,
    isPaused,
    questions,
  } = state

  const currentQ = questions.find((q) => q.id === currentQuestion)
  const isCurrentCompleted =
    currentQ?.status === 'completed' && currentQ.secondsSpent != null
  const isRunning =
    totalQuestions > 0 && !isPaused && !isCurrentCompleted

  const { time } = useTimer(
    timePerQuestion,
    isRunning,
    currentQuestion
  )

  const displaySeconds = isCurrentCompleted ? currentQ.secondsSpent : time

  function handleMarkComplete() {
    if (!currentQ || currentQ.status === 'completed') return
    const spent = Math.min(
      timePerQuestion,
      Math.max(0, timePerQuestion - time)
    )
    dispatch({ type: 'COMPLETE_QUESTION', payload: { secondsSpent: spent } })
  }

  const canMarkComplete = Boolean(currentQ && currentQ.status !== 'completed')

  // Only redirect invalid /session visits (e.g. direct URL). Do not depend on
  // totalQuestions changing — END_SESSION sets it to 0 and would trigger a
  // spurious navigate('/') that overrides /congrats after "End session".
  useEffect(() => {
    if (totalQuestions === 0) navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only gate
  }, [])

  if (totalQuestions === 0) return null

  const completed = questions.filter((q) => q.status === 'completed').length
  const attempted = questions.filter((q) => q.status === 'attempted').length
  const important = questions.filter((q) => q.markedImportant).length
  const review = questions.filter((q) => q.markedReview).length

  return (
    <div className="relative mx-auto flex h-svh max-h-svh w-full max-w-3xl flex-col overflow-hidden overscroll-none px-4 pb-[env(safe-area-inset-bottom,0px)] pt-4 sm:px-8 sm:pt-5">
      <JumpingMascots />
      <header className="shrink-0 border-b border-zinc-800 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-left text-lg font-semibold leading-snug text-white sm:text-xl">
            {sessionName}
          </h1>
          <button
            type="button"
            onClick={async () => {
              const finalized = finalizeSessionState(state)
              const id = await saveSession(finalized, user)
              navigate('/congrats', { state: { sessionId: id } })
              dispatch({ type: 'END_SESSION' })
            }}
            className="shrink-0 rounded-2xl border-2 border-rose-500/50 bg-rose-600/20 px-4 py-2.5 text-sm font-semibold text-rose-100 shadow-md shadow-rose-950/20 transition hover:border-rose-400/70 hover:bg-rose-600/35 sm:px-6 sm:py-3 sm:text-base"
          >
            End session
          </button>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-1 rounded-2xl border border-emerald-500/20 bg-emerald-950/25 px-3 py-3 sm:gap-2 sm:py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-500/90 sm:text-[11px]">
            {isCurrentCompleted ? 'Time taken' : 'Time remaining'}
          </p>
          <Timer
            seconds={displaySeconds}
            paused={isPaused && !isCurrentCompleted}
            prominent
            recorded={isCurrentCompleted}
          />
        </div>
      </header>

      <div className="mt-2 shrink-0">
        <QuestionPanel
          current={currentQuestion}
          total={totalQuestions}
          markedImportant={currentQ?.markedImportant ?? false}
          markedReview={currentQ?.markedReview ?? false}
          onToggleImportant={() =>
            dispatch({ type: 'TOGGLE_IMPORTANT', payload: currentQuestion })
          }
          onToggleReview={() =>
            dispatch({ type: 'TOGGLE_REVIEW', payload: currentQuestion })
          }
        />
      </div>

      <div className="mt-2 min-h-0 max-h-[min(50svh,27rem)] flex-1 overflow-hidden py-1">
        <SessionAmbientArt />
      </div>

      <div className="mt-3 shrink-0 rounded-3xl border-2 border-fuchsia-500/40 bg-fuchsia-950/35 p-3 shadow-[0_12px_40px_rgba(131,24,67,0.25)] sm:p-4">
        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={!canMarkComplete}
          className="w-full rounded-2xl border-2 border-pink-400/70 bg-pink-600/35 px-5 py-4 text-lg font-bold tracking-tight text-pink-50 shadow-inner shadow-pink-950/40 transition sm:px-6 sm:py-5 sm:text-xl enabled:hover:border-pink-300 enabled:hover:bg-pink-600/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isCurrentCompleted
            ? `Completed · ${formatMmSs(currentQ.secondsSpent)}`
            : currentQuestion < totalQuestions
              ? 'Mark complete → next'
              : 'Mark complete (last question)'}
        </button>
      </div>

      <div className="mt-3 shrink-0 pt-1 sm:mt-4">
        <Controls
          onPrev={() => dispatch({ type: 'PREV' })}
          onNext={() => dispatch({ type: 'NEXT' })}
          onPauseResume={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          isPaused={isPaused}
          canPrev={currentQuestion > 1}
          canNext={currentQuestion < totalQuestions}
          pauseDisabled={isCurrentCompleted}
        />
      </div>

      <footer className="mt-2 shrink-0 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-center text-[11px] text-zinc-500 sm:text-xs">
        Progress: {completed} completed · {attempted} skipped · {important} important ·{' '}
        {review} review
      </footer>
    </div>
  )
}
