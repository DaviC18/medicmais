import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { LazyMotion, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { loadMotionFeatures } from './loadFeatures'

type MagneticButtonProps = {
  /** O CTA real (`<a>` / `Button`). Ele mantém foco, href e eventos. */
  children: ReactNode
  className?: string
  /** Fração do deslocamento do ponteiro aplicada ao botão. Padrão: 0.25. */
  strength?: number
  /** Deslocamento máximo em px. Padrão: 8. */
  max?: number
}

/** Mesmo valor de `MQ_FINE_POINTER` em lib/gsap (sem importar o GSAP aqui). */
const MQ_FINE_POINTER = '(hover: hover) and (pointer: fine)'
const SPRING = { type: 'spring', stiffness: 260, damping: 20, mass: 0.6 } as const
const REST = { x: 0, y: 0 }

/**
 * Wrapper "magnético" para o CTA principal: o botão segue levemente o
 * ponteiro e volta com mola ao sair; leve compressão no toque/click.
 *
 * - Só ativo com mouse/trackpad (`(hover: hover) and (pointer: fine)`).
 *   Em touch vira um wrapper inerte.
 * - Desligado com reduced motion.
 * - Anima só transform do `<span>` wrapper — o filho fica livre (pode estar
 *   dentro de `data-anim="hero-cta"`, que é animado pelo GSAP no PAI).
 * - Motion enxuto: `motion/react-m` + features assíncronas (DECISIONS D22). Até
 *   o chunk chegar, é um `<span>` comum e o CTA funciona normalmente. O alvo
 *   (x/y) vai por `animate`, com uma atualização por frame no máximo.
 *
 * @example
 * <div data-anim="hero-cta" className="flex gap-3">
 *   <MagneticButton>
 *     <a href={whatsappLink()} onClick={() => trackWhatsApp('hero')} target="_blank" rel="noopener noreferrer">
 *       Agendar pelo WhatsApp
 *     </a>
 *   </MagneticButton>
 * </div>
 */
export function MagneticButton({ children, className, strength = 0.25, max = 8 }: MagneticButtonProps) {
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery(MQ_FINE_POINTER)
  const active = finePointer && !reduce

  const [target, setTarget] = useState(REST)
  const frame = useRef(0)

  const clamp = (v: number) => Math.max(-max, Math.min(max, v))

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const next = {
      x: Math.round(clamp((e.clientX - (r.left + r.width / 2)) * strength)),
      y: Math.round(clamp((e.clientY - (r.top + r.height / 2)) * strength)),
    }
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() =>
      setTarget((prev) => (prev.x === next.x && prev.y === next.y ? prev : next)),
    )
  }
  const reset = () => {
    cancelAnimationFrame(frame.current)
    setTarget(REST)
  }

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <m.span
        className={cn('inline-flex', className)}
        animate={active ? target : REST}
        transition={SPRING}
        onPointerMove={active ? onPointerMove : undefined}
        onPointerLeave={active ? reset : undefined}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}
