import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

const { numeros } = clinica
const copy = pendingCopy.secoes.numeros
const fmt = new Intl.NumberFormat('pt-BR')

/** #numeros — só com dado real (clinica.numeros). Vazio = não renderiza. */
export default function Stats() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  if (numeros.length === 0) return null

  return (
    <Section ref={scope} id="numeros" tone="alt">
      <Container>
        <h2 data-anim="title" className="text-title text-ink">
          {copy.titulo}
        </h2>
        <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {numeros.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse border-t border-ink/12 pt-6">
              <dt className="mt-2 text-ink-muted">{stat.label}</dt>
              <dd className="font-display text-title text-ink tabular-nums">
                <span data-anim="count" data-value={stat.value} data-suffix={stat.suffix ?? ''}>
                  {fmt.format(stat.value)}
                  {stat.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  )
}
