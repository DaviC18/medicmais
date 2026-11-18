import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { iconFor } from '@/sections/_icons'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

const { slogan, sobre } = clinica

/** #sobre — texto institucional + diferenciais em lista editorial (sem grade de cards). */
export default function About() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <Section ref={scope} id="sobre" tone="alt">
      <Container className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 data-anim="title" className="text-title text-ink">
            {slogan}
          </h2>
          <p data-anim="fade-up" className="mt-6 max-w-reading text-lead text-ink-muted">
            {sobre.texto}
          </p>
        </div>

        <ul data-anim="stagger" className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:pt-2">
          {sobre.diferenciais.map((item) => {
            const Icon = iconFor(item.icon)
            return (
              <li key={item.titulo} className="border-t border-ink/12 py-8">
                <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-subtitle text-ink">{item.titulo}</h3>
                <p className="mt-2 text-ink-muted">{item.texto}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
