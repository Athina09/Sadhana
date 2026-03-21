import { useState, useEffect } from 'react'

/**
 * Countdown per question. Resets when `resetKey` changes (e.g. question index).
 * @param {number} initialSeconds
 * @param {boolean} isRunning - false when paused
 * @param {string|number} resetKey - change to reset timer to initialSeconds
 */
export default function useTimer(initialSeconds, isRunning, resetKey) {
  const [time, setTime] = useState(initialSeconds)

  useEffect(() => {
    setTime(initialSeconds)
  }, [initialSeconds, resetKey])

  // Restart interval when question changes or when pause/resume toggles so ticks never
  // run while paused and we never stack stale intervals.
  useEffect(() => {
    if (!isRunning) return

    const id = setInterval(() => {
      setTime((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(id)
  }, [isRunning, resetKey])

  return { time, setTime }
}
