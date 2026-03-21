import { useState } from 'react'

const baseForm =
  'mx-auto flex w-full max-w-md flex-col gap-5 rounded-2xl border p-8 shadow-xl backdrop-blur'

const variants = {
  default: {
    form: `${baseForm} border-zinc-800 bg-zinc-900/60`,
    label: 'mb-1.5 block text-sm text-zinc-400',
    input:
      'w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40',
    hint: 'mt-1 block text-xs text-zinc-500',
    submit:
      'mt-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500',
  },
  ghibli: {
    form: `${baseForm} border-[#3d5c4a]/80 bg-[#1b3022]/75 shadow-[0_20px_50px_rgba(10,20,16,0.55)] backdrop-blur-md`,
    label: 'mb-1.5 block text-sm text-[#c8e6c9]/90',
    input:
      'w-full rounded-xl border border-[#4a6b55]/70 bg-[#0f1f18]/70 px-4 py-3 text-[#f5f5dc] placeholder:text-[#7a9a7a]/60 focus:border-[#a4c639]/55 focus:outline-none focus:ring-1 focus:ring-[#a4c639]/25',
    hint: 'mt-1 block text-xs text-[#8fbc8f]/80',
    submit:
      'mt-2 rounded-xl bg-[#5c8f3e] px-4 py-3.5 text-sm font-semibold text-[#f5f5dc] shadow-[0_8px_24px_rgba(60,100,40,0.35)] transition hover:bg-[#6ba348]',
  },
}

export default function SessionForm({ onStart, variant = 'default' }) {
  const [sessionName, setSessionName] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [minutes, setMinutes] = useState(2)
  const [seconds, setSeconds] = useState(0)

  const v = variants[variant] ?? variants.default

  function handleSubmit(e) {
    e.preventDefault()
    const name = sessionName.trim() || 'Practice session'
    const n = Math.min(999, Math.max(1, Number(totalQuestions) || 1))
    const m = Math.max(0, Math.min(180, Number(minutes) || 0))
    const s = Math.max(0, Math.min(59, Number(seconds) || 0))
    const timePerQuestion = m * 60 + s || 60
    onStart({ sessionName: name, totalQuestions: n, timePerQuestion })
  }

  return (
    <form onSubmit={handleSubmit} className={v.form}>
      <div>
        <label htmlFor="sn" className={v.label}>
          Session name
        </label>
        <input
          id="sn"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="e.g. Electrostatics PYQ"
          className={v.input}
        />
      </div>

      <div>
        <label htmlFor="nq" className={v.label}>
          Number of questions
        </label>
        <input
          id="nq"
          type="number"
          min={1}
          max={999}
          value={totalQuestions}
          onChange={(e) => setTotalQuestions(e.target.value)}
          className={v.input}
        />
      </div>

      <div>
        <span className={v.label}>Time per question</span>
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="tm" className="sr-only">
              Minutes
            </label>
            <input
              id="tm"
              type="number"
              min={0}
              max={180}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className={v.input}
            />
            <span className={v.hint}>min</span>
          </div>
          <div className="flex-1">
            <label htmlFor="ts" className="sr-only">
              Seconds
            </label>
            <input
              id="ts"
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              className={v.input}
            />
            <span className={v.hint}>sec</span>
          </div>
        </div>
      </div>

      <button type="submit" className={v.submit}>
        Start session
      </button>
    </form>
  )
}
