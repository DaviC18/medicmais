import type { ReactNode } from 'react'

export type FabRevealProps = {
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

/** Classes do container fixo (compartilhadas entre a versão animada e o fallback). */
export const FAB_POSITION =
  'fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50'
