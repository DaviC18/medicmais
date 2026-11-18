import type { ReactNode } from 'react'
import { LazyMotion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import * as m from 'motion/react-m'
import { cn } from '@/lib/utils'
import { loadMotionFeatures } from './loadFeatures'

type MotionCardProps = Omit<HTMLMotionProps<'article'>, 'children'> & {
  children?: ReactNode
  /** Elemento externo (alvo do GSAP `stagger`). Use `li` dentro de `<ul>`. */
  wrapperAs?: 'div' | 'li'
  /** Classes do wrapper externo. Padrão: `h-full` (cards de mesma altura no grid). */
  wrapperClassName?: string
  /** Deslocamento do hover em px. Padrão: 4. */
  lift?: number
}

/**
 * Card com microinteração de hover: sobe `lift` px e ganha `shadow-lift`.
 *
 * Estrutura: `<wrapper>` (div/li, livre para o GSAP, ex.: filhos de
 * `data-anim="stagger"`) → `<m.article>` (só o Motion anima). Assim GSAP
 * e Motion nunca disputam o mesmo elemento.
 *
 * - A sombra extra é um pseudo-elemento cuja opacity transiciona (sem animar
 *   box-shadow → sem repaint caro). Também acende com foco por teclado. É CSS
 *   puro: funciona antes de o Motion carregar.
 * - O lift usa `motion/react-m` + `LazyMotion` com features assíncronas
 *   (`loadMotionFeatures`): o card renderiza no 1º paint como `<article>` comum
 *   e ganha o hover quando o chunk de features chega (DECISIONS D22).
 * - Com reduced motion, não há deslocamento; só a sombra.
 * - Hover do Motion já ignora toque (não "gruda" no mobile).
 *
 * @example
 * <ul data-anim="stagger" className="grid gap-6 md:grid-cols-2">
 *   {clinica.servicos.map((s) => (
 *     <MotionCard key={s.id} wrapperAs="li" className="rounded-xl bg-card p-6 shadow-card">
 *       …
 *     </MotionCard>
 *   ))}
 * </ul>
 */
export function MotionCard({
  children,
  className,
  wrapperAs = 'div',
  wrapperClassName = 'h-full',
  lift = 4,
  ...props
}: MotionCardProps) {
  const reduce = useReducedMotion()
  const Wrapper = wrapperAs

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <Wrapper className={wrapperClassName}>
        <m.article
          whileHover={reduce ? undefined : { y: -lift }}
          transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.8 }}
          className={cn(
            'relative h-full',
            "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift after:transition-opacity after:duration-300 after:ease-out-soft after:content-['']",
            'hover:after:opacity-100 focus-within:after:opacity-100',
            className,
          )}
          {...props}
        >
          {children}
        </m.article>
      </Wrapper>
    </LazyMotion>
  )
}
