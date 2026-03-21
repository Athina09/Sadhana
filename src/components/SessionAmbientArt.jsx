import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { SESSION_ART_IMAGES } from '../sessionArt'

const ROTATE_MS = 60_000
const n = SESSION_ART_IMAGES.length

export default function SessionAmbientArt() {
  const [index, setIndex] = useState(0)
  const [srcA, setSrcA] = useState(SESSION_ART_IMAGES[0])
  const [srcB, setSrcB] = useState(SESSION_ART_IMAGES[1 % n])

  const rootRef = useRef(null)
  const wrapRef = useRef(null)
  const layerARef = useRef(null)
  const layerBRef = useRef(null)
  const primaryARef = useRef(true)
  const lastProcessedIndex = useRef(-1)
  const motionCtx = useRef(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (lastProcessedIndex.current === -1) {
      lastProcessedIndex.current = index
      if (!reduced && wrapRef.current && layerARef.current && layerBRef.current) {
        motionCtx.current?.revert()
        motionCtx.current = gsap.context(() => {
          const wrap = wrapRef.current
          const imgA = layerARef.current
          const imgB = layerBRef.current

          gsap.set([imgA, imgB], { transformOrigin: '50% 50%' })

          gsap.to(wrap, {
            x: 10,
            y: -8,
            duration: 16,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })

          gsap.to(imgA, {
            x: '6%',
            y: '-5%',
            scale: 1.12,
            rotation: 0.4,
            duration: 26,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })

          gsap.to(imgB, {
            x: '-5%',
            y: '6%',
            scale: 1.1,
            rotation: -0.35,
            duration: 30,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1.2,
          })
        }, rootRef)
      }
      return
    }

    if (lastProcessedIndex.current === index) return

    const a = layerARef.current
    const b = layerBRef.current
    if (!a || !b) return

    if (reduced) {
      const nextSrc = SESSION_ART_IMAGES[index]
      if (primaryARef.current) {
        setSrcB(nextSrc)
        gsap.set(a, { opacity: 0 })
        gsap.set(b, { opacity: 1 })
        primaryARef.current = false
      } else {
        setSrcA(nextSrc)
        gsap.set(b, { opacity: 0 })
        gsap.set(a, { opacity: 1 })
        primaryARef.current = true
      }
      lastProcessedIndex.current = index
      return
    }

    const nextSrc = SESSION_ART_IMAGES[index]

    if (primaryARef.current) {
      setSrcB(nextSrc)
      gsap
        .timeline()
        .to(a, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(b, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      primaryARef.current = false
    } else {
      setSrcA(nextSrc)
      gsap
        .timeline()
        .to(b, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(a, { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      primaryARef.current = true
    }
    lastProcessedIndex.current = index
  }, [index])

  useLayoutEffect(() => {
    return () => motionCtx.current?.revert()
  }, [])

  return (
    <div ref={rootRef} className="pointer-events-none w-full select-none" aria-hidden>
      <div
        ref={wrapRef}
        className="relative aspect-[2/1] w-full min-h-[13rem] overflow-hidden rounded-3xl border border-zinc-800/90 bg-zinc-950/60 shadow-[0_16px_50px_rgba(0,0,0,0.5)] sm:aspect-[21/9] sm:min-h-[min(52vh,22rem)] md:min-h-[min(56vh,26rem)]"
        style={{ willChange: 'transform' }}
      >
        <img
          ref={layerARef}
          src={srcA}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-100"
          draggable={false}
          style={{ willChange: 'transform' }}
        />
        <img
          ref={layerBRef}
          src={srcB}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          draggable={false}
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  )
}
