import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Menu } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { useHeaderHide } from '@/hooks/useHeaderHide'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

// Popup do menu mobile sob demanda (DECISIONS D27). Root e Trigger ficam no JS inicial:
// o botão funciona desde o 1º paint e o Root guarda o estado até o Popup chegar.
// Sem React.lazy/Suspense: com o Popup dentro de um Suspense, o Base UI deixava o foco sair
// do menu pelo Tab. O componente só é renderizado depois de importado.
const loadMobileMenu = () => import('@/components/ui/mobile-menu')
type MobileMenuComponent = Awaited<ReturnType<typeof loadMobileMenu>>['default']
const MQ_DESKTOP_NAV = '(min-width: 80rem)' // xl: nav inline, sem menu

const { nome, logo, ui } = clinica
const { labels } = ui

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Header fixo: marca, âncoras (xl+), CTA WhatsApp; menu em Sheet abaixo de xl. */
export default function Header() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  // Popup do menu: importado na 1ª intenção (hover/foco/toque no botão), ao abrir, ou no ocioso.
  const [MobileMenu, setMobileMenu] = useState<MobileMenuComponent | null>(null)
  const wantMenu = useCallback(() => {
    loadMobileMenu().then(
      (mod) => setMobileMenu(() => mod.default),
      () => undefined,
    )
  }, [])
  // Âncora clicada dentro do Sheet: rola só depois que o Sheet fecha (o scroll lock bloqueia antes).
  const pendingHash = useRef<string | null>(null)

  useHeaderHide(ref, { disabled: open })

  // Abaixo de lg, baixa o chunk do menu quando o navegador fica ocioso após o load.
  useEffect(() => {
    if (window.matchMedia(MQ_DESKTOP_NAV).matches) return
    let idle = 0
    const prefetch = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
      idle = ric(wantMenu)
    }
    if (document.readyState === 'complete') prefetch()
    else window.addEventListener('load', prefetch, { once: true })
    return () => {
      window.removeEventListener('load', prefetch)
      if (idle) (window.cancelIdleCallback ?? window.clearTimeout)(idle)
    }
  }, [wantMenu])

  const onSheetLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    pendingHash.current = href
    setOpen(false)
  }

  const onOpenChangeComplete = (isOpen: boolean) => {
    if (isOpen || !pendingHash.current) return
    const hash = pendingHash.current
    pendingHash.current = null
    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', hash)
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-40 h-header border-b border-line/70 bg-surface/90 backdrop-blur-md"
    >
      <Container className="flex h-full items-center justify-between gap-6">
        <a href="#inicio" className="flex min-w-0 items-center gap-2.5 rounded-lg py-1">
          <picture className="shrink-0">
            <source srcSet={logo.avif} type="image/avif" />
            <source srcSet={logo.webp} type="image/webp" />
            <img src={logo.src} alt="" width={logo.width} height={logo.height} className="size-9" />
          </picture>
          <span className="truncate font-display text-lead leading-none font-medium tracking-tight text-ink">
            {nome}
          </span>
        </a>

        <nav aria-label={labels.navPrincipal} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {ui.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-small font-medium text-ink-muted transition-colors hover:bg-ink/[0.05] hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <WhatsAppCta origem="header" size="sm" className="hidden min-h-11 px-5 md:inline-flex" />

          <Dialog.Root
            open={open}
            onOpenChange={(next) => {
              if (next) wantMenu()
              setOpen(next)
            }}
            onOpenChangeComplete={onOpenChangeComplete}
          >
            <Dialog.Trigger
              aria-label={labels.menuAbrir}
              onPointerEnter={wantMenu}
              onFocus={wantMenu}
              className="-mr-2.5 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] xl:hidden"
            >
              <Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </Dialog.Trigger>
            {MobileMenu && <MobileMenu onLink={onSheetLink} />}
          </Dialog.Root>
        </div>
      </Container>
    </header>
  )
}
