const btnBase =
  'flex flex-1 items-center justify-center rounded-3xl border px-2 py-5 text-lg font-semibold transition sm:min-h-[4.5rem] sm:px-5 sm:py-6 sm:text-xl md:min-h-[5.25rem] md:text-2xl'

export default function Controls({
  onPrev,
  onNext,
  onPauseResume,
  isPaused,
  canPrev,
  canNext,
}) {
  return (
    <div className="flex w-full flex-row items-stretch gap-2 sm:gap-4 md:gap-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={`${btnBase} min-h-[4rem] border-zinc-600 bg-zinc-900 text-zinc-100 enabled:hover:border-zinc-500 enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={onPauseResume}
        className={`${btnBase} min-h-[4rem] border-emerald-500/55 bg-emerald-600/25 text-emerald-100 shadow-[0_10px_36px_rgba(6,78,59,0.4)] hover:border-emerald-400/70 hover:bg-emerald-600/35`}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={`${btnBase} min-h-[4rem] border-zinc-600 bg-zinc-900 text-zinc-100 enabled:hover:border-zinc-500 enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
      </button>
    </div>
  )
}
