import type { MouseEvent } from 'react'
import { Phone, X } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { telLink } from '@/lib/whatsapp'
import { SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

const { ui } = clinica
const { labels } = ui

type MobileMenuProps = {
  /** Clique numa âncora: o Header fecha o menu e rola depois que o Sheet termina de fechar. */
  onLink: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}

/**
 * Conteúdo do menu mobile (Popup do Sheet). Carregado sob demanda pelo Header (`React.lazy`),
 * para o Popup/Portal/FocusManager do Base UI ficarem fora do JS inicial (DECISIONS D27).
 * Precisa ser renderizado dentro de `<Dialog.Root>`.
 */
export default function MobileMenu({ onLink }: MobileMenuProps) {
  return (
    <SheetContent
      side="right"
      showCloseButton={false}
      className="w-[min(22rem,88vw)] gap-0 border-line bg-surface p-0"
    >
      <div className="flex h-header shrink-0 items-center justify-between px-gutter">
        <SheetTitle className="font-sans text-small font-medium text-ink-muted">{labels.menuTitulo}</SheetTitle>
        <SheetClose
          aria-label={labels.menuFechar}
          className="-mr-2.5 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
        >
          <X className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </SheetClose>
      </div>
      <nav aria-label={labels.navPrincipal} className="overflow-y-auto px-gutter pt-2">
        <ul className="flex flex-col">
          {ui.nav.map((item) => (
            <li key={item.href} className="border-b border-line last:border-b-0">
              <a
                href={item.href}
                onClick={(event) => onLink(event, item.href)}
                className="flex min-h-14 items-center font-display text-subtitle text-ink transition-colors hover:text-brand"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-line px-gutter pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <WhatsAppCta origem="header-mobile" className="w-full" />
        <a
          href={telLink()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-small font-medium text-ink transition-colors hover:bg-ink/[0.05]"
        >
          <Phone className="size-4" aria-hidden="true" />
          <span className="flex flex-wrap justify-center gap-x-1.5">
            <span>{ui.ctaLigar}</span>
            <span className="whitespace-nowrap tabular-nums">{clinica.telefone}</span>
          </span>
        </a>
      </div>
    </SheetContent>
  )
}
