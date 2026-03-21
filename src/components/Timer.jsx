function formatMmSs(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function Timer({
  seconds,
  paused = false,
  className = '',
  prominent = false,
}) {
  const label = paused
    ? `Paused at ${formatMmSs(seconds)}`
    : `Time remaining ${formatMmSs(seconds)}`

  return (
    <div
      className={`flex flex-col ${
        prominent ? 'items-center gap-2' : 'items-start gap-1'
      } ${className}`}
    >
      <div
        className={`font-mono tabular-nums tracking-tight ${
          prominent
            ? 'text-5xl font-bold tabular-nums sm:text-6xl md:text-7xl'
            : 'text-4xl font-semibold'
        } ${
          paused
            ? 'text-zinc-500'
            : prominent
              ? 'text-emerald-300 drop-shadow-[0_0_32px_rgba(52,211,153,0.5)] sm:drop-shadow-[0_0_44px_rgba(45,212,191,0.4)]'
              : 'text-emerald-400'
        }`}
        aria-live="polite"
        aria-label={label}
      >
        {formatMmSs(seconds)}
      </div>
      {paused && (
        <span
          className={`font-medium uppercase tracking-wide text-amber-400/90 ${
            prominent ? 'text-sm' : 'text-xs'
          }`}
        >
          Paused
        </span>
      )}
    </div>
  )
}
