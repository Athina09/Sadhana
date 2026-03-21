export default function QuestionPanel({
  current,
  total,
  markedImportant,
  markedReview,
  onToggleImportant,
  onToggleReview,
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500/90 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-base text-zinc-300 sm:text-lg">
        Question{' '}
        <span className="font-semibold text-white">
          {current} / {total}
        </span>
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggleImportant}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition sm:px-4 sm:py-2.5 ${
            markedImportant
              ? 'border-amber-400/80 bg-amber-500/20 text-amber-200'
              : 'border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
          }`}
        >
          Important ⭐
        </button>
        <button
          type="button"
          onClick={onToggleReview}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition sm:px-4 sm:py-2.5 ${
            markedReview
              ? 'border-sky-400/80 bg-sky-500/20 text-sky-200'
              : 'border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
          }`}
        >
          Review 🔁
        </button>
      </div>
    </div>
  )
}
