import { useEffect, useRef } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import confetti from 'canvas-confetti'
import mascotImg from '../assets/congrats-mascot.png'

function fireCelebration() {
  const end = Date.now() + 2800
  const colors = ['#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa']

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.65 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.65 },
      colors,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    ticks: 320,
    gravity: 0.9,
    scalar: 1.1,
  })

  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 160,
      origin: { x: 0.18, y: 0.55 },
      colors,
    })
    confetti({
      particleCount: 80,
      spread: 160,
      origin: { x: 0.82, y: 0.55 },
      colors,
    })
  }, 220)
}

export default function CongratsPage() {
  const location = useLocation()
  const sessionId = location.state?.sessionId
  const fired = useRef(false)

  useEffect(() => {
    if (!sessionId || fired.current) return
    fired.current = true
    fireCelebration()
  }, [sessionId])

  if (!sessionId) {
    return <Navigate to="/history" replace />
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-emerald-500/90">
        Session saved
      </p>
      <div className="relative isolate mb-2 flex justify-center drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)]">
        <img
          src={mascotImg}
          alt=""
          width={280}
          height={280}
          className="congrats-mascot pointer-events-none h-44 w-auto max-w-[min(100%,280px)] select-none object-contain sm:h-52"
          draggable={false}
        />
      </div>
      <h1 className="font-serif text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
        Congrats!!!
      </h1>
      <p className="mt-6 max-w-md text-lg text-zinc-400">
        Nice work — your session is in history. You can review it anytime.
      </p>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/history"
          className="rounded-2xl bg-emerald-600 px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-500"
        >
          Session history
        </Link>
        <Link
          to={`/history/${sessionId}`}
          className="rounded-2xl border border-zinc-600 bg-zinc-900 px-8 py-4 text-center text-base font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          Review this session
        </Link>
      </div>

      <Link to="/" className="mt-8 text-sm font-medium text-zinc-500 hover:text-zinc-300">
        ← Home
      </Link>
    </div>
  )
}
