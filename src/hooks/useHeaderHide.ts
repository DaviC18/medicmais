import type { RefObject } from 'react'
import { gsap, loadScrollTrigger, MQ_MOTION_OK, useGSAP } from '@/lib/gsap'

export type UseHeaderHideOptions = {
  /**
   * Força o header visível (ex.: menu mobile/Sheet aberto). Quando `true`,
   * o header aparece e não esconde até voltar a `false`.
   */
  disabled?: boolean
  /** Rolagem mínima (px) antes de começar a esconder. Padrão: 120. */
  offset?: number
}

/**
 * Esconde o header ao rolar para baixo e mostra ao rolar para cima (SPEC §3).
 *
 * - Anima só `yPercent` (transform) do elemento do ref. Use no `<header>`
 *   fixo/sticky; não aplique Motion nesse mesmo elemento.
 * - Expõe o estado em `data-hidden="true|false"` no header (útil para
 *   estilos, ex.: sombra só quando rolado).
 * - Volta a aparecer quando algo dentro dele recebe foco (teclado) e no topo
 *   da página.
 * - Com `prefers-reduced-motion: reduce` o header fica sempre visível.
 * - Usa o ScrollTrigger sob demanda (`loadScrollTrigger`): até ele chegar o
 *   header só fica visível, que é o estado natural no topo da página.
 *
 * @example
 * const ref = useRef<HTMLElement>(null)
 * const [open, setOpen] = useState(false)
 * useHeaderHide(ref, { disabled: open })
 * <header ref={ref} className="fixed inset-x-0 top-0 z-40 h-header">…</header>
 */
export function useHeaderHide(
  ref: RefObject<HTMLElement | null>,
  { disabled = false, offset = 120 }: UseHeaderHideOptions = {},
): void {
  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      el.dataset.hidden = 'false'
      let cancelled = false
      let mm: gsap.MatchMedia | undefined

      loadScrollTrigger().then((ScrollTrigger) => {
        if (cancelled) return
        mm = gsap.matchMedia()
        mm.add(MQ_MOTION_OK, () => {
          let hidden = false
          const set = (next: boolean) => {
            if (next === hidden) return
            hidden = next
            el.dataset.hidden = String(next)
            gsap.to(el, {
              yPercent: next ? -100 : 0,
              duration: next ? 0.35 : 0.45,
              ease: next ? 'power2.in' : 'power3.out',
              overwrite: 'auto',
            })
          }

          if (disabled) {
            set(false)
            return
          }

          const st = ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              if (self.scroll() < offset) set(false)
              else set(self.direction === 1)
            },
          })

          const onFocus = () => set(false)
          el.addEventListener('focusin', onFocus)

          return () => {
            st.kill()
            el.removeEventListener('focusin', onFocus)
          }
        })
      }).catch(() => {
        // Sem ScrollTrigger (rede): conteúdo fica no estado final, sem animação.
      })

      return () => {
        cancelled = true
        mm?.revert()
        el.dataset.hidden = 'false'
      }
    },
    { dependencies: [disabled, offset], revertOnUpdate: true },
  )
}
