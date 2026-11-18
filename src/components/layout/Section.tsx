import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = Omit<ComponentProps<'section'>, 'id'> & {
  id: string
  /** base = surface; alt = surface-2 (seções alternadas) */
  tone?: 'base' | 'alt'
}

/**
 * Bloco de seção da página. Aceita `ref` (React 19) para useReveal(scope).
 * Padding vertical fluido (py-section) e offset de âncora do header (scroll-mt-header).
 */
export function Section({ id, tone = 'base', className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-header py-section',
        tone === 'alt' ? 'bg-surface-2' : 'bg-surface',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export default Section
