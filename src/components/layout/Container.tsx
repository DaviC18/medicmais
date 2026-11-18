import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = ComponentProps<'div'> & {
  /** page = largura da página (max-w-page); reading = texto corrido (max-w-reading) */
  size?: 'page' | 'reading'
}

/** Centraliza o conteúdo com gutter lateral fluido (px-gutter). */
export function Container({ size = 'page', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-gutter', size === 'page' ? 'max-w-page' : 'max-w-reading', className)}
      {...props}
    />
  )
}

export default Container
