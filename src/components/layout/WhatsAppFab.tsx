import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { trackWhatsApp, whatsappLink } from '@/lib/whatsapp'
import { FabReveal } from '@/components/motion/FabReveal'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

/**
 * Botão flutuante do WhatsApp. FabReveal (03-motion) é o elemento `fixed` e mostra o botão
 * após 30% de rolagem. Verde oficial com ícone em whatsapp-ink (branco sobre o verde não passa AA).
 */
export default function WhatsAppFab() {
  return (
    <FabReveal>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsApp('fab')}
        aria-label={`${clinica.ui.ctaWhatsapp} ${pendingCopy.labels.novaAba}`}
        className="grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-ink shadow-lift transition-shadow duration-200 ease-out-soft hover:shadow-card sm:size-16"
      >
        <WhatsAppIcon className="size-7 sm:size-8" />
      </a>
    </FabReveal>
  )
}
