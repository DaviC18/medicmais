import { lazy, Suspense, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { FAB_POSITION, type FabRevealProps } from './fabTypes'
import { importMotionFeatures } from './loadFeatures'

/** Fallback se o chunk animado falhar: FAB fixo, sempre visível, sem animação. */
function FabStatic({ children, className }: FabRevealProps) {
  return <div className={cn(FAB_POSITION, className)}>{children}</div>
}

/**
 * Chunk animado + features do Motion juntos: quando o componente monta, as
 * features já estão prontas (sem frame com `initial` "preso" em opacity 0).
 * Se a rede falhar, cai no FabStatic (o CTA nunca some por falta de JS).
 */
const FabRevealMotion = lazy(() =>
  Promise.all([import('./FabRevealMotion'), importMotionFeatures()])
    .then(([mod]) => mod)
    .catch(() => ({ default: FabStatic })),
)

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

/**
 * Mostra o FAB depois de `threshold` (30%) de rolagem e esconde ao voltar
 * acima disso (SPEC §3). Entrada: fade + y + scale leve; com reduced motion,
 * só fade.
 *
 * Carregamento (DECISIONS D22): este shell vai no JS inicial e não importa o
 * Motion. A implementação animada (`FabRevealMotion`) é baixada quando o
 * navegador fica ocioso após o load, ou no primeiro scroll — o que vier
 * antes. Como o FAB só aparece depois de 30% de rolagem, nada visível depende
 * do chunk no 1º paint.
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
export function FabReveal(props: FabRevealProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const w = window as IdleWindow
    let idleId: number | undefined
    let timeoutId: number | undefined
    const go = () => setReady(true)

    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(go, { timeout: 2000 })
      else timeoutId = window.setTimeout(go, 1200)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    window.addEventListener('scroll', go, { once: true, passive: true })

    return () => {
      window.removeEventListener('load', schedule)
      window.removeEventListener('scroll', go)
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <FabRevealMotion {...props} />
    </Suspense>
  )
}
