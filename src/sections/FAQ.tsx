import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

const { faq } = clinica
const copy = pendingCopy.secoes.faq

/** #faq — perguntas em Accordion (Base UI: teclado e aria prontos). */
export default function FAQ() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  if (faq.length === 0) return null

  return (
    <Section ref={scope} id="faq" tone="alt">
      <Container className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+3rem)] lg:col-span-4 lg:self-start">
          <h2 data-anim="title" className="text-title text-ink">
            {copy.titulo}
          </h2>
          <p data-anim="fade-up" className="mt-5 max-w-[30ch] text-ink-muted">
            {copy.intro}
          </p>
          <div data-anim="fade-up" data-delay="0.1" className="mt-8">
            <WhatsAppCta origem="faq" />
          </div>
        </div>

        <div data-anim="fade-up" className="lg:col-span-8">
          <Accordion className="border-t border-ink/12">
            {faq.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-b border-ink/12">
                <AccordionTrigger className="gap-6 py-6 hover:no-underline **:data-[slot=accordion-trigger-icon]:mt-1.5 **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-brand">
                  <span className="font-display text-lead font-medium text-ink">{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-7">
                  <p className="max-w-reading text-body text-ink-muted">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  )
}
