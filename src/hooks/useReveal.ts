import type { RefObject } from 'react'
import {
  gsap,
  MQ_DESKTOP,
  MQ_MOTION_OK,
  PRESETS,
  readDelay,
  REVEAL_START,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from '@/lib/gsap'

const NUMBER_RE = /-?\d[\d.,]*/

type CountParts = { prefix: string; suffix: string; decimals: number; value: number }

/** Separa prefixo/sufixo do texto final (ex.: "+1.500 pacientes"). */
function readCount(el: HTMLElement): CountParts | null {
  const raw = el.dataset.value
  if (!raw) return null
  const value = Number(raw)
  if (!Number.isFinite(value)) return null

  const decimalsAttr = el.dataset.decimals
  const decimals = decimalsAttr !== undefined
    ? Math.max(0, Number.parseInt(decimalsAttr, 10) || 0)
    : (raw.split('.')[1]?.length ?? 0)

  let prefix = el.dataset.prefix ?? ''
  let suffix = el.dataset.suffix ?? ''
  if (el.dataset.prefix === undefined && el.dataset.suffix === undefined) {
    const text = el.textContent ?? ''
    const match = NUMBER_RE.exec(text)
    if (match) {
      prefix = text.slice(0, match.index)
      suffix = text.slice(match.index + match[0].length)
    }
  }
  return { prefix, suffix, decimals, value }
}

/**
 * Reveals por scroll guiados por atributos (CONTRACTS §2).
 *
 * Marque elementos dentro de `scope` com `data-anim`:
 * - `title`    — palavras sobem com fade (SplitText, acessível via aria-label).
 * - `fade-up`  — fade + y:24.
 * - `stagger`  — filhos DIRETOS entram em sequência (0.08s).
 * - `scale-in` — scale 0.96→1 + fade.
 * - `parallax` — translateY leve atrelado ao scroll; só ≥ 768px.
 * - `count`    — conta de 0 até `data-value` (número JS, ex.: "1500", "4.9"),
 *                formatado em pt-BR. Opcionais: `data-decimals`, `data-prefix`,
 *                `data-suffix` (se ausentes, são inferidos do texto atual).
 * Opcional em todos: `data-delay="0.2"` (segundos).
 *
 * Garantias:
 * - Sem `prefers-reduced-motion: no-preference` nada é animado e nada é escondido.
 * - O estado inicial "escondido" é aplicado só pelo JS (antes do paint, via
 *   useLayoutEffect do useGSAP); o HTML/CSS sempre tem o estado final.
 * - Disparo em `top 80%`, uma vez (`once: true`); tudo é revertido no unmount.
 * - Só transform/opacity.
 *
 * Não marque com `data-anim` um elemento animado por Motion (ex.: MotionCard
 * já separa wrapper GSAP e elemento Motion internamente).
 *
 * @example
 * const scope = useRef<HTMLElement>(null)
 * useReveal(scope)
 * return (
 *   <Section ref={scope} id="servicos">
 *     <h2 data-anim="title">{clinica.ui.servicosTitulo}</h2>
 *     <ul data-anim="stagger">{cards}</ul>
 *     <strong data-anim="count" data-value="1500" className="tabular-nums">1.500</strong>
 *   </Section>
 * )
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const q = <T extends Element = HTMLElement>(v: string) =>
        gsap.utils.toArray<T>(`[data-anim="${v}"]`, root)

      const mm = gsap.matchMedia()

      mm.add(MQ_MOTION_OK, () => {
        const trigger = (el: Element) => ({ trigger: el, start: REVEAL_START, once: true })

        q('fade-up').forEach((el) => {
          gsap.from(el, {
            ...PRESETS.fadeUp.from,
            duration: PRESETS.fadeUp.duration,
            ease: PRESETS.fadeUp.ease,
            delay: readDelay(el),
            scrollTrigger: trigger(el),
          })
        })

        q('scale-in').forEach((el) => {
          gsap.from(el, {
            ...PRESETS.scaleIn.from,
            duration: PRESETS.scaleIn.duration,
            ease: PRESETS.scaleIn.ease,
            delay: readDelay(el),
            scrollTrigger: trigger(el),
          })
        })

        q('stagger').forEach((el) => {
          const items = Array.from(el.children)
          if (!items.length) return
          gsap.from(items, {
            ...PRESETS.stagger.from,
            duration: PRESETS.stagger.duration,
            ease: PRESETS.stagger.ease,
            stagger: PRESETS.stagger.each,
            delay: readDelay(el),
            scrollTrigger: trigger(el),
          })
        })

        q('title').forEach((el) => {
          const delay = readDelay(el)
          // autoSplit refaz o split quando as fontes carregam/largura muda;
          // a animação retornada em onSplit é recriada mantendo o progresso.
          SplitText.create(el, {
            type: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                ...PRESETS.titleWords.from,
                duration: PRESETS.titleWords.duration,
                ease: PRESETS.titleWords.ease,
                stagger: { amount: PRESETS.titleWords.amount },
                delay,
                scrollTrigger: trigger(el),
              }),
          })
        })

        const restore: Array<() => void> = []
        q('count').forEach((el) => {
          const parts = readCount(el)
          if (!parts) return
          const original = el.textContent
          const fmt = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: parts.decimals,
            maximumFractionDigits: parts.decimals,
          })
          const counter = { v: 0 }
          const render = () => {
            el.textContent = `${parts.prefix}${fmt.format(counter.v)}${parts.suffix}`
          }
          // Estado inicial (0) aplicado só pelo JS; o HTML traz o valor final.
          render()
          gsap.to(counter, {
            v: parts.value,
            duration: PRESETS.count.duration,
            ease: PRESETS.count.ease,
            delay: readDelay(el),
            onUpdate: render,
            // Termina com o texto original exato (sem resíduo de arredondamento).
            onComplete: () => {
              el.textContent = original
            },
            scrollTrigger: trigger(el),
          })
          restore.push(() => {
            el.textContent = original
          })
        })

        return () => restore.forEach((fn) => fn())
      })

      mm.add(`${MQ_MOTION_OK} and ${MQ_DESKTOP}`, () => {
        q('parallax').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -PRESETS.parallax.yPercent / 2 },
            {
              yPercent: PRESETS.parallax.yPercent / 2,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
      })

      // Fontes/imagens podem mudar alturas depois do primeiro layout.
      if (document.readyState !== 'complete') {
        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener('load', onLoad, { once: true })
        return () => {
          window.removeEventListener('load', onLoad)
          mm.revert()
        }
      }
      return () => mm.revert()
    },
    { scope },
  )
}
