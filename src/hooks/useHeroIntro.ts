import type { RefObject } from 'react'
import { gsap, MQ_HERO_WIDE, MQ_MOTION_OK, SplitText, useGSAP } from '@/lib/gsap'

/**
 * Timeline de entrada do Hero (CONTRACTS §2). Total ≈ 1.4s (≤ 1.6s).
 *
 * Marque dentro de `scope`:
 * - `data-anim="hero-badge"` — selo/eyebrow (fade + y).
 * - `data-anim="hero-title"` — h1. A partir de 1024px (foto ao lado = LCP),
 *   as palavras sobem com fade (SplitText, revertido ao fim → DOM volta a ser
 *   texto puro). Abaixo de 1024px o h1 é o LCP: só um leve assentamento em y,
 *   SEM opacity, para pintar no 1º frame (DECISIONS D24).
 * - `data-anim="hero-sub"`   — subtítulo (fade + y).
 * - `data-anim="hero-cta"`   — wrapper dos CTAs; pode haver mais de um
 *   (entram em sequência).
 * - `data-anim="hero-media"` — wrapper da foto. NÃO recebe opacity: só um
 *   scale 1.04→1, para a imagem (candidata a LCP) pintar no 1º frame.
 *
 * Garantias: nada roda com `prefers-reduced-motion: reduce`; o estado
 * inicial é aplicado só via JS, antes do paint (useLayoutEffect); só
 * transform/opacity; revertido no unmount.
 *
 * Parallax da foto: coloque `data-anim="parallax"` num elemento INTERNO ao
 * `hero-media` (ex.: o `<img>`) e chame também `useReveal(scope)` — assim
 * intro e parallax nunca disputam o mesmo transform.
 *
 * Não use `hero-title` num texto já animado por componente React Bits
 * (SplitText/BlurText), nem em elementos com Motion.
 *
 * @example
 * const scope = useRef<HTMLElement>(null)
 * useHeroIntro(scope)
 * useReveal(scope) // parallax da foto
 * <Section ref={scope} id="inicio">
 *   <p data-anim="hero-badge">…</p>
 *   <h1 data-anim="hero-title">{clinica.hero.titulo}</h1>
 *   <p data-anim="hero-sub">{clinica.hero.subtitulo}</p>
 *   <div data-anim="hero-cta">…botões…</div>
 *   <div data-anim="hero-media" className="overflow-hidden rounded-3xl">
 *     <img data-anim="parallax" fetchPriority="high" … />
 *   </div>
 * </Section>
 */
export function useHeroIntro(scope: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const one = (v: string) => root.querySelector<HTMLElement>(`[data-anim="${v}"]`)

      const mm = gsap.matchMedia()
      mm.add({ motion: MQ_MOTION_OK, wide: MQ_HERO_WIDE }, (ctx) => {
        const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean }
        if (!motion) return
        const badge = one('hero-badge')
        const title = one('hero-title')
        const sub = one('hero-sub')
        const ctas = gsap.utils.toArray<HTMLElement>('[data-anim="hero-cta"]', root)
        const media = one('hero-media')

        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

        if (media) {
          tl.from(media, { scale: 1.04, duration: 1.4, ease: 'expo.out' }, 0)
        }
        if (badge) {
          tl.from(badge, { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
        }
        if (title && !wide) {
          tl.from(title, { y: '0.25em', duration: 1, ease: 'expo.out' }, 0.05)
        }
        if (title && wide) {
          const split = SplitText.create(title, { type: 'words' })
          tl.from(
            split.words,
            {
              autoAlpha: 0,
              y: '0.35em',
              duration: 0.9,
              ease: 'expo.out',
              stagger: { amount: 0.3 },
            },
            0.1,
          )
          // Devolve o h1 a texto puro ao fim (reflow/resize sem spans).
          tl.call(() => split.revert())
        }
        if (sub) {
          tl.from(sub, { autoAlpha: 0, y: 16 }, 0.45)
        }
        if (ctas.length) {
          tl.from(ctas, { autoAlpha: 0, y: 16, stagger: 0.08 }, 0.6)
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}
