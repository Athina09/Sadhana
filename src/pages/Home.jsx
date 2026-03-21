import { useRef, useLayoutEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import SessionForm from '../components/SessionForm'
import { useSession } from '../context/SessionContext'

const HOME_BACKGROUND_SRC = '/ghibli-clover-bg.png'

export default function Home() {
  const navigate = useNavigate()
  const { dispatch } = useSession()
  const rootRef = useRef(null)
  const bgWrapRef = useRef(null)
  const bgImgRef = useRef(null)
  const vignetteRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)

  function handleStart({ sessionName, totalQuestions, timePerQuestion }) {
    dispatch({
      type: 'START_SESSION',
      payload: { sessionName, totalQuestions, timePerQuestion },
    })
    navigate('/session')
  }

  useLayoutEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduced) {
        if (contentRef.current) {
          gsap.set(contentRef.current.children, { opacity: 1, y: 0 })
        }
        return
      }

      if (bgImgRef.current) {
        gsap.set(bgImgRef.current, {
          transformOrigin: '50% 45%',
          scale: 1.06,
        })
        gsap.to(bgImgRef.current, {
          scale: 1.12,
          x: '0.8%',
          y: '-0.6%',
          duration: 22,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (bgWrapRef.current) {
        gsap.to(bgWrapRef.current, {
          rotation: 0.25,
          duration: 16,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      if (vignetteRef.current) {
        gsap.fromTo(
          vignetteRef.current,
          { opacity: 0.4 },
          {
            opacity: 0.55,
            duration: 8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }
        )
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          opacity: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out',
          delay: 0.15,
        })
      }

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -3,
          duration: 3.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative min-h-svh">
      <div
        ref={bgWrapRef}
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <img
          ref={bgImgRef}
          src={HOME_BACKGROUND_SRC}
          alt=""
          className="h-[118%] w-[118%] max-w-none -translate-x-[8%] -translate-y-[6%] object-cover object-center opacity-[0.98] brightness-[1.04] contrast-[1.02] saturate-[1.03]"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#0a140f]/48 via-[#1b3022]/32 to-[#0d1a14]/58"
        aria-hidden
      />
      <div
        ref={vignetteRef}
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_76%_at_50%_42%,transparent_0%,transparent_38%,#0a140f_94%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-lg flex-col justify-center px-4 py-12">
        <div ref={contentRef} className="flex flex-col">
          <header ref={titleRef} className="mb-10 text-center">
            <p className="mb-2 font-serif text-xs font-medium uppercase tracking-[0.35em] text-[#c8e6c9]/80">
              Practice
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#f5f5dc] drop-shadow-[0_2px_24px_rgba(10,20,16,0.85)] sm:text-5xl">
              Sadhana
            </h1>
            <p className="mt-3 text-base text-[#b8d4b8]/95 drop-shadow-md sm:text-lg">
              Timed practice — one question at a time.
            </p>
            <Link
              to="/history"
              className="mx-auto mt-8 flex w-full max-w-md items-center justify-center rounded-2xl border-2 border-[#f5f5dc]/25 bg-[#1b3022]/55 px-8 py-5 text-lg font-semibold text-[#f5f5dc] shadow-[0_12px_40px_rgba(10,20,16,0.45)] transition hover:border-[#a4c639]/45 hover:bg-[#234030]/70 sm:text-xl"
            >
              Session history →
            </Link>
          </header>
          <SessionForm onStart={handleStart} variant="ghibli" />
        </div>
      </div>
    </div>
  )
}
