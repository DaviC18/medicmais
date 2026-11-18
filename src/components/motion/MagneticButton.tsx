import type { PointerEvent, ReactNode } from 'react'
import { domAnimation, LazyMotion, m, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

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
const SPRING = { stiffness: 260, damping: 20, mass: 0.6 }

/**
 * Wrapper "magnético" para o CTA principal: o botão segue levemente o
 * ponteiro e volta com mola ao sair; leve compressão no toque/click.
 *
 * - Só ativo com mouse/trackpad (`(hover: hover) and (pointer: fine)`).
 *   Em touch vira um wrapper inerte.
 * - Desligado com reduced motion.
 * - Anima só transform do `<span>` wrapper — o filho fica livre (pode estar
 *   dentro de `data-anim="hero-cta"`, que é animado pelo GSAP no PAI).
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

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, SPRING)
  const y = useSpring(my, SPRING)

  const clamp = (v: number) => Math.max(-max, Math.min(max, v))

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!active || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(clamp((e.clientX - (r.left + r.width / 2)) * strength))
    my.set(clamp((e.clientY - (r.top + r.height / 2)) * strength))
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.span
        className={cn('inline-flex', className)}
        style={active ? { x, y } : undefined}
        onPointerMove={active ? onPointerMove : undefined}
        onPointerLeave={active ? reset : undefined}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        {children}
      </m.span>
    </LazyMotion>
  )
}
