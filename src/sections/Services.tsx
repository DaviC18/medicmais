import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { iconFor } from '@/sections/_icons'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'
import { MotionCard } from '@/components/motion/MotionCard'

const { servicos, ui } = clinica
const copy = pendingCopy.secoes.servicos

/** #servicos — título fixo à esquerda (lg) e cards em colunas desencontradas. */
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

        {/* GSAP anima o <li> (wrapper do MotionCard); o hover Motion fica no <article> interno. */}
        <ul data-anim="stagger" className="grid items-start gap-5 sm:grid-cols-2 lg:col-span-8">
          {servicos.map((servico) => {
            const Icon = iconFor(servico.icon)
            return (
              <MotionCard
                key={servico.id}
                wrapperAs="li"
                wrapperClassName="h-full sm:even:mt-14"
                lift={3}
                className="rounded-xl bg-card p-7 shadow-soft sm:p-8"
              >
                  <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-subtitle text-ink sm:mt-10">{servico.title}</h3>
                  <p className="mt-3 text-ink-muted">{servico.description}</p>
              </MotionCard>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
