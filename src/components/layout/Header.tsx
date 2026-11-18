import { useRef, useState, type MouseEvent } from 'react'
import { Menu, Phone, X } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { telLink } from '@/lib/whatsapp'
import { useHeaderHide } from '@/hooks/useHeaderHide'
import { Container } from '@/components/layout/Container'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

const { nome, logo, ui } = clinica
const { labels } = pendingCopy

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Header fixo: marca, âncoras (lg+), CTA WhatsApp; menu em Sheet abaixo de lg. */
export default function Header() {
  const ref = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  // Âncora clicada dentro do Sheet: rola só depois que o Sheet fecha (o scroll lock bloqueia antes).
  const pendingHash = useRef<string | null>(null)

  useHeaderHide(ref, { disabled: open })

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

        <nav aria-label={labels.navPrincipal} className="hidden lg:block">
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

          <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={onOpenChangeComplete}>
            <SheetTrigger
              aria-label={labels.menuAbrir}
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
            >
              <Menu className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-[min(22rem,88vw)] gap-0 border-line bg-surface p-0"
            >
              <div className="flex h-header items-center justify-between px-gutter">
                <SheetTitle className="font-medium text-ink-muted">
                  <span className="text-small">{labels.menuTitulo}</span>
                </SheetTitle>
                <SheetClose
                  aria-label={labels.menuFechar}
                  className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
                >
                  <X className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </SheetClose>
              </div>
              <nav aria-label={labels.navPrincipal} className="px-gutter pt-2">
                <ul className="flex flex-col">
                  {ui.nav.map((item) => (
                    <li key={item.href} className="border-b border-line last:border-b-0">
                      <a
                        href={item.href}
                        onClick={(event) => onSheetLink(event, item.href)}
                        className="flex min-h-14 items-center font-display text-subtitle text-ink transition-colors hover:text-brand"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-line px-gutter py-6">
                <WhatsAppCta origem="header-mobile" className="w-full" />
                <a
                  href={telLink()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-small font-medium text-ink hover:bg-ink/[0.05]"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {ui.ctaLigar} · {clinica.telefone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
