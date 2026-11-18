import { useEffect, useState } from 'react'
import { AnimatePresence, LazyMotion, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { cn } from '@/lib/utils'
import { FAB_POSITION, type FabRevealProps } from './fabTypes'
import { loadMotionFeatures } from './loadFeatures'

/** Fração da página já rolada (0–1). */
function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? window.scrollY / max : 0
}

/**
 * Implementação animada do FabReveal. Carregada sob demanda por `FabReveal`
 * (React.lazy) — não importe direto. Usa um listener de scroll passivo (sem
 * `useScroll`) e só re-renderiza quando cruza o limite.
 */
export default function FabRevealMotion({ children, className, threshold = 0.3 }: FabRevealProps) {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(() => scrollProgress() >= threshold)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(scrollProgress() >= threshold)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [threshold])

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence>
        {visible && (
          <m.div
            key="fab"
            className={cn(FAB_POSITION, className)}
            initial={hidden}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={hidden}
            transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
