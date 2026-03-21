import { Link, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { deleteSession, loadSessions } from '../utils/sessionHistory'

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function formatMmSs(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

function totalSecondsSpent(questions) {
  if (!Array.isArray(questions)) return 0
  return questions.reduce(
    (sum, q) => sum + (typeof q.secondsSpent === 'number' ? q.secondsSpent : 0),
    0
  )
}

export default function HistoryPage() {
  const location = useLocation()
  const [listVersion, setListVersion] = useState(0)
  const sessions = useMemo(
    () => loadSessions(),
    [location.key, listVersion]
  )

  function handleDelete(id) {
    deleteSession(id)
    setListVersion((v) => v + 1)
  }

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Session history
          </h1>
          <p className="mt-3 text-base text-zinc-400 sm:text-lg">
            Review past practice sessions and marks.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-600"
        >
          ← New session
        </Link>
      </header>

      {sessions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-12 text-center text-zinc-500">
          No sessions yet. End a practice session to save it here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => {
            const completed = s.questions.filter((q) => q.status === 'completed')
              .length
            const attempted = s.questions.filter((q) => q.status === 'attempted')
              .length
            const important = s.questions.filter((q) => q.markedImportant).length
            const review = s.questions.filter((q) => q.markedReview).length
            const totalTime = totalSecondsSpent(s.questions)
            return (
              <li key={s.id}>
                <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-zinc-700 sm:flex-row sm:items-stretch">
                  <Link
                    to={`/history/${s.id}`}
                    className="flex min-w-0 flex-1 flex-col gap-2 px-5 py-4 transition hover:bg-zinc-900/80"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-medium text-zinc-100">{s.sessionName}</span>
                      <span className="text-xs text-zinc-500">{formatDate(s.endedAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span>{s.totalQuestions} questions</span>
                      <span>{completed} completed</span>
                      <span>{attempted} skipped</span>
                      {totalTime > 0 && (
                        <span className="text-zinc-400">
                          {formatMmSs(totalTime)} total on completed
                        </span>
                      )}
                      <span>{important} important</span>
                      <span>{review} review</span>
                    </div>
                  </Link>
                  <div className="flex shrink-0 items-center border-t border-zinc-800 px-3 py-2 sm:border-l sm:border-t-0 sm:px-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="w-full rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2.5 text-sm font-medium text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-950/50 sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
