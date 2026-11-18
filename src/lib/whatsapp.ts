import { clinica } from '@/data/clinica'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/** Mantém só dígitos e garante o DDI 55 (Brasil). */
function toE164Digits(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('55') && digits.length > 11 ? digits : `55${digits}`
}

/** https://wa.me/<num>?text=<mensagem codificada>. Padrão: clinica.whatsappMsg. */
export function whatsappLink(msg: string = clinica.whatsappMsg): string {
  return `https://wa.me/${toE164Digits(clinica.whatsapp)}?text=${encodeURIComponent(msg)}`
}

/** tel:+55... a partir de um telefone em formato de exibição. Padrão: clinica.telefone. */
export function telLink(phone: string = clinica.telefone): string {
  return `tel:+${toE164Digits(phone)}`
}

/** Dispara `whatsapp_click` no dataLayer do GTM. `origem` = onde o CTA está (ex.: 'hero', 'fab'). */
export function trackWhatsApp(origem: string): void {
  if (typeof window === 'undefined') return
  window.dataLayer?.push({ event: 'whatsapp_click', origem })
}
