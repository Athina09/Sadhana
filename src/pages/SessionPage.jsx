import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Timer from '../components/Timer'
import QuestionPanel from '../components/QuestionPanel'
import Controls from '../components/Controls'
import { useSession } from '../context/SessionContext'
import useTimer from '../hooks/useTimer'
import { finalizeSessionState, saveSession } from '../utils/sessionHistory'
import JumpingMascots from '../components/JumpingMascots'
import SessionAmbientArt from '../components/SessionAmbientArt'

export default function SessionPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useSession()
  const {
    sessionName,
    totalQuestions,
    currentQuestion,
    timePerQuestion,
    isPaused,
    questions,
  } = state

  const isRunning = totalQuestions > 0 && !isPaused
  const { time } = useTimer(
    timePerQuestion,
    isRunning,
    currentQuestion
  )

  const currentQ = questions.find((q) => q.id === currentQuestion)

  // Only redirect invalid /session visits (e.g. direct URL). Do not depend on
  // totalQuestions changing — END_SESSION sets it to 0 and would trigger a
  // spurious navigate('/') that overrides /congrats after "End session".
  useEffect(() => {
    if (totalQuestions === 0) navigate('/', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only gate
  }, [])

  if (totalQuestions === 0) return null

  const attempted = questions.filter((q) => q.status === 'attempted').length
  const important = questions.filter((q) => q.markedImportant).length
  const review = questions.filter((q) => q.markedReview).length

  return (
    <div className="relative mx-auto flex min-h-svh max-w-3xl flex-col px-4 pb-52 pt-8 sm:px-8 sm:pb-56">
      <JumpingMascots />
      <header className="mb-8 flex flex-col gap-6 border-b border-zinc-800 pb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 flex-1 text-left text-xl font-semibold leading-snug text-white sm:text-2xl">
            {sessionName}
          </h1>
          <button
            type="button"
            onClick={() => {
              const finalized = finalizeSessionState(state)
              const id = saveSession(finalized)
              // Navigate before END_SESSION so SessionPage’s totalQuestions===0 effect
              // does not call navigate('/') and override /congrats.
              navigate('/congrats', { state: { sessionId: id } })
              dispatch({ type: 'END_SESSION' })
            }}
            className="shrink-0 rounded-2xl border-2 border-rose-500/50 bg-rose-600/20 px-6 py-3.5 text-base font-semibold text-rose-100 shadow-md shadow-rose-950/20 transition hover:border-rose-400/70 hover:bg-rose-600/35 sm:px-8 sm:py-4 sm:text-lg"
          >
            End session
          </button>
        </div>
        <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/25 px-4 py-6 sm:gap-4 sm:py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-500/90 sm:text-xs">
            Time remaining
          </p>
          <Timer seconds={time} paused={isPaused} prominent />
        </div>
      </header>

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

      <div className="mt-8 flex min-h-[min(50vh,28rem)] w-full flex-1 flex-col sm:mt-10">
        <SessionAmbientArt />
      </div>

      <div className="mt-6 w-full sm:mt-8">
        <Controls
          onPrev={() => dispatch({ type: 'PREV' })}
          onNext={() => dispatch({ type: 'NEXT' })}
          onPauseResume={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          isPaused={isPaused}
          canPrev={currentQuestion > 1}
          canNext={currentQuestion < totalQuestions}
        />
      </div>

      <footer className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-center text-xs text-zinc-500">
        Progress: {attempted} attempted · {important} important · {review} review
      </footer>
    </div>
  )
}
