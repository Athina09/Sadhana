import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'

/** Bottom-left mascot — jump + bounce only (no top corner). */
export default function JumpingMascots({ className = '' }) {
  const rootRef = useRef(null)
  const jumpRef = useRef(null)

  useLayoutEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const el = jumpRef.current
      if (!el || reduced) return

      const tl = gsap.timeline({ repeat: -1 })
      tl.to(el, { y: -32, duration: 0.28, ease: 'power2.out' })
        .to(el, { y: 0, duration: 0.42, ease: 'bounce.out' })
        .to(el, {}, { duration: 0.45 })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none fixed bottom-3 left-2 z-40 flex items-end justify-start sm:bottom-5 sm:left-4 md:bottom-6 md:left-6 ${className}`}
      aria-hidden
    >
      <div
        ref={jumpRef}
        className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/mascots-cats.png"
          alt=""
          className="h-auto max-h-[20rem] w-auto max-w-[30rem] object-contain object-left sm:max-h-[25rem] sm:max-w-[38rem] md:max-h-[28rem] md:max-w-[44rem]"
          draggable={false}
        />
      </div>
    </div>
  )
}
