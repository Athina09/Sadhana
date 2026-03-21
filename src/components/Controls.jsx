const btnBase =
  'flex flex-1 items-center justify-center rounded-2xl border px-2 py-3 text-base font-semibold transition sm:min-h-[3.25rem] sm:px-4 sm:py-4 sm:text-lg md:min-h-[3.5rem] md:text-xl'

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
        className={`${btnBase} min-h-[3rem] border-zinc-600 bg-zinc-900 text-zinc-100 enabled:hover:border-zinc-500 enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={onPauseResume}
        className={`${btnBase} min-h-[3rem] border-emerald-500/55 bg-emerald-600/25 text-emerald-100 shadow-[0_10px_36px_rgba(6,78,59,0.4)] hover:border-emerald-400/70 hover:bg-emerald-600/35`}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={`${btnBase} min-h-[3rem] border-zinc-600 bg-zinc-900 text-zinc-100 enabled:hover:border-zinc-500 enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
      </button>
    </div>
  )
}
