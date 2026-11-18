import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { iconFor } from '@/sections/_icons'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

const { servicos, ui } = clinica
const copy = ui.secoes.servicos

/**
 * #servicos — título fixo à esquerda (lg) e os serviços como linhas de um único painel.
 * Sem card por item: os serviços não são links, então nada sobe no hover (DECISIONS D26).
 */
export default function Services() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <Section ref={scope} id="servicos">
      <Container className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+3rem)] lg:col-span-4 lg:self-start">
          <h2 data-anim="title" className="text-title text-ink">
            {copy.titulo}
          </h2>
          <p data-anim="fade-up" className="mt-6 max-w-reading text-lead text-ink-muted">
            {copy.intro}
          </p>
          <div data-anim="fade-up" data-delay="0.1" className="mt-9">
            <WhatsAppCta origem="servicos" label={ui.ctaAgendarAvaliacao} />
          </div>
        </div>

        <ul
          data-anim="stagger"
          className="divide-y divide-line rounded-xl bg-card px-6 shadow-soft sm:px-10 lg:col-span-8"
        >
          {servicos.map((servico) => {
            const Icon = iconFor(servico.icon)
            return (
              <li
                key={servico.id}
                className="grid gap-x-10 gap-y-3 py-8 sm:grid-cols-[minmax(0,11fr)_minmax(0,10fr)] sm:py-10"
              >
                <h3 className="flex items-start gap-4 text-subtitle text-ink">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="pt-1">{servico.title}</span>
                </h3>
                <p className="text-ink-muted sm:pt-1.5">{servico.description}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
