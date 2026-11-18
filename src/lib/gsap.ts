/**
 * Ponto único de entrada do GSAP no projeto (dono: 03-motion).
 *
 * - Registra ScrollTrigger, SplitText e o hook `useGSAP` uma única vez.
 * - Define defaults coerentes com o SPEC §2 (calmo e elegante:
 *   `power3.out`, 0.8s).
 * - Exporta media queries e presets nomeados usados pelos hooks em
 *   `src/hooks/`.
 *
 * As seções NÃO importam daqui: usam `useReveal` / `useHeroIntro`
 * (CONTRACTS §2). Só os hooks de `src/hooks/**` consomem este módulo.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

// Evita recalcular todos os triggers quando a barra de endereço do mobile
// aparece/some (resize só de altura) — reduz jank e trabalho no main thread.
ScrollTrigger.config({ ignoreMobileResize: true })

/** Animações completas só para quem não pediu movimento reduzido. */
export const MQ_MOTION_OK = '(prefers-reduced-motion: no-preference)'
/** Parallax e efeitos de scroll mais pesados: só a partir do tablet. */
export const MQ_DESKTOP = '(min-width: 768px)'
/** Dispositivo com hover real e ponteiro fino (mouse/trackpad). */
export const MQ_FINE_POINTER = '(hover: hover) and (pointer: fine)'

/** Ponto de disparo padrão dos reveals (CONTRACTS/SPEC). */
export const REVEAL_START = 'top 80%'

/**
 * Presets nomeados. Valores "from" (estado inicial) — o estado final é
 * sempre o natural do CSS, então se o JS falhar o conteúdo fica visível.
 * Só transform e opacity.
 */
export const PRESETS = {
  fadeUp: { from: { autoAlpha: 0, y: 24 }, duration: 0.8, ease: 'power3.out' },
  scaleIn: { from: { autoAlpha: 0, scale: 0.96 }, duration: 0.9, ease: 'power3.out' },
  stagger: { from: { autoAlpha: 0, y: 24 }, duration: 0.7, ease: 'power3.out', each: 0.08 },
  titleWords: { from: { autoAlpha: 0, y: '0.4em' }, duration: 0.9, ease: 'expo.out', amount: 0.3 },
  count: { duration: 1.6, ease: 'power2.out' },
  parallax: { yPercent: -8 },
} as const

/** Lê `data-delay` (segundos) com fallback seguro. */
export function readDelay(el: Element): number {
  const raw = (el as HTMLElement).dataset?.delay
  const n = raw ? Number.parseFloat(raw) : 0
  return Number.isFinite(n) && n > 0 ? n : 0
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
