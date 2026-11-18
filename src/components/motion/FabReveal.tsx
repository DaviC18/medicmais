import { useState, type ReactNode } from 'react'
import { AnimatePresence, domAnimation, LazyMotion, m, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { cn } from '@/lib/utils'

type FabRevealProps = {
  /** O botão flutuante (link do WhatsApp). NÃO use `position: fixed` nele. */
  children: ReactNode
  /**
   * Posicionamento do container fixo. Padrão: canto inferior direito com
   * safe-area. Sobrescreva se precisar.
   */
  className?: string
  /** Fração da página rolada para aparecer (0–1). Padrão: 0.3. */
  threshold?: number
}

/**
 * Mostra o FAB depois de `threshold` (30%) de rolagem e esconde ao voltar
 * acima disso (SPEC §3). Entrada: fade + y + scale leve; com reduced motion,
 * só fade.
 *
 * O próprio FabReveal é o elemento `fixed` (um ancestral com transform
 * quebraria um `fixed` no filho). Escondido, o FAB sai do DOM (fora da
 * ordem de Tab).
 *
 * @example
 * <FabReveal>
 *   <a href={whatsappLink()} onClick={() => trackWhatsApp('fab')} aria-label="Agendar pelo WhatsApp"
 *      className="grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-ink shadow-lift">
 *     <MessageCircle aria-hidden />
 *   </a>
 * </FabReveal>
 */
export function FabReveal({ children, className, threshold = 0.3 }: FabRevealProps) {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v >= threshold
    setVisible((prev) => (prev === next ? prev : next))
  })

  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {visible && (
          <m.div
            key="fab"
            className={cn(
              'fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50',
              className,
            )}
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
