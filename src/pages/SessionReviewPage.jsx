import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { deleteSession, getSessionById } from '../utils/sessionHistory'

function formatMmSs(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export default function SessionReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const session = useMemo(() => (id ? getSessionById(id) : null), [id])

  function handleDelete() {
    if (!session) return
    deleteSession(session.id)
    navigate('/history', { replace: true })
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-500">Session not found.</p>
        <Link
          to="/history"
          className="mt-6 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Back to history
        </Link>
      </div>
    )
  }

  const completed = session.questions.filter((q) => q.status === 'completed').length
  const attempted = session.questions.filter((q) => q.status === 'attempted').length
  const important = session.questions.filter((q) => q.markedImportant).length
  const review = session.questions.filter((q) => q.markedReview).length
  const totalTimeSpent = session.questions.reduce(
    (sum, q) => sum + (typeof q.secondsSpent === 'number' ? q.secondsSpent : 0),
    0
  )

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Review</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{session.sessionName}</h1>
          <p className="mt-2 text-sm text-zinc-500">{formatDate(session.endedAt)}</p>
          <p className="mt-3 text-sm text-zinc-400">
            {session.totalQuestions} questions · {formatMmSs(session.timePerQuestion)} budget per
            question
            {totalTimeSpent > 0 && (
              <span className="block text-zinc-300">
                Total time on completed questions: {formatMmSs(totalTimeSpent)}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/history"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-600"
          >
            All sessions
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2.5 text-sm font-medium text-rose-200 hover:border-rose-400/60 hover:bg-rose-950/50"
          >
            Delete
          </button>
          <Link
            to="/"
            className="rounded-xl border border-emerald-600/40 bg-emerald-600/15 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-600/25"
          >
            New session
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center text-sm sm:grid-cols-4">
        <div>
          <p className="text-zinc-500">Completed</p>
          <p className="text-lg font-semibold text-emerald-200">{completed}</p>
        </div>
        <div>
          <p className="text-zinc-500">Skipped</p>
          <p className="text-lg font-semibold text-zinc-100">{attempted}</p>
        </div>
        <div>
          <p className="text-zinc-500">Important</p>
          <p className="text-lg font-semibold text-amber-200">{important}</p>
        </div>
        <div>
          <p className="text-zinc-500">Review</p>
          <p className="text-lg font-semibold text-sky-200">{review}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-500">
              <th className="px-4 py-3 font-medium">Q#</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Marks</th>
            </tr>
          </thead>
          <tbody>
            {session.questions.map((q) => (
              <tr
                key={q.id}
                className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/30"
              >
                <td className="px-4 py-3 font-mono text-zinc-300">{q.id}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {q.status === 'completed'
                    ? 'Completed'
                    : q.status === 'attempted'
                      ? 'Skipped'
                      : 'Unseen'}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-200">
                  {typeof q.secondsSpent === 'number' ? formatMmSs(q.secondsSpent) : '—'}
                </td>
                <td className="px-4 py-3 text-zinc-300">
                  {[q.markedImportant && '⭐ Important', q.markedReview && '🔁 Review']
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
