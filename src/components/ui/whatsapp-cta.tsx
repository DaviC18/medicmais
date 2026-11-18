import type { ComponentProps } from 'react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { trackWhatsApp, whatsappLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

/**
 * Estilo único de botão da página (pílula). `brand` = vermelho da marca (CTA principal);
 * `quiet` = contorno navy (ação secundária); `inverse` = sobre fundo navy.
 * Obs.: não passe utilitários de tamanho de texto (text-lead etc.) por `className` junto com cor:
 * o tailwind-merge padrão confunde os tokens próprios de tamanho com cor (pedido no HANDOFF).
 */
export const ctaStyles = {
  base: 'group/cta inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out-soft active:translate-y-px',
  brand: 'bg-brand text-white shadow-soft hover:bg-brand-strong hover:shadow-card',
  quiet: 'border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-ink/[0.04]',
  inverse: 'bg-surface text-ink hover:bg-surface-2',
  /** tamanhos ficam fora do cn() de propósito (ver nota acima) */
  size: {
    md: 'text-body',
    sm: 'text-small',
  },
} as const

type WhatsAppCtaProps = Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel' | 'children'> & {
  /** origem do clique no dataLayer (ex.: 'hero', 'header', 'fab') */
  origem: string
  label?: string
  tone?: 'brand' | 'inverse'
  size?: 'md' | 'sm'
  /** mensagem pré-preenchida; padrão clinica.whatsappMsg */
  msg?: string
}

/** CTA de agendamento: abre o WhatsApp em nova aba e dispara `whatsapp_click`. */
export function WhatsAppCta({
  origem,
  label = clinica.ui.ctaWhatsapp,
  tone = 'brand',
  size = 'md',
  msg,
  className,
  onClick,
  ...props
}: WhatsAppCtaProps) {
  return (
    <a
      href={whatsappLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackWhatsApp(origem)
        onClick?.(event)
      }}
      className={`${cn(ctaStyles.base, ctaStyles[tone], className)} ${ctaStyles.size[size]}`}
      {...props}
    >
      <WhatsAppIcon className="size-[1.15em] shrink-0" />
      <span>{label}</span>
      <span className="sr-only"> {pendingCopy.labels.novaAba}</span>
    </a>
  )
}

export default WhatsAppCta
