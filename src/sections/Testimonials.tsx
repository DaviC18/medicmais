import { useRef } from 'react'
import { Star } from 'lucide-react'
import { clinica } from '@/data/clinica'
import type { Testimonial } from '@/data/types'
import { pendingCopy } from '@/sections/_pending-copy'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

const { depoimentos } = clinica
const copy = pendingCopy.secoes.depoimentos
// Avaliação literal só quando vier do Google com autor identificado; o resto é resumo.
const isLiteral = (d: Testimonial) => d.source === 'google' && d.name !== 'Paciente'
const temResumo = depoimentos.some((d) => !isLiteral(d))

function Stars({ rating }: { rating: Testimonial['rating'] }) {
  return (
    <div className="flex gap-1 text-brand">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-4"
          fill={i < rating ? 'currentColor' : 'none'}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">
        {rating} {pendingCopy.labels.estrelas}
      </span>
    </div>
  )
}

/**
 * #depoimentos — momento tipográfico: avaliações em serifa grande, sem cards.
 * Resumos (source 'site' / nome genérico) não usam aspas nem autor: não são citações literais.
 */
export default function Testimonials() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  if (depoimentos.length === 0) return null

  return (
    <Section ref={scope} id="depoimentos">
      <Container className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-anim="title" className="text-title text-ink">
            {copy.titulo}
          </h2>
          {temResumo && (
            <p data-anim="fade-up" className="mt-5 max-w-[28ch] text-small text-ink-muted">
              {copy.nota}
            </p>
          )}
        </div>

        <ul data-anim="stagger" className="lg:col-span-8">
          {depoimentos.map((d, i) => (
            <li key={`${d.text}-${i}`} className="border-t border-line py-8 first:border-t-0 first:pt-0 lg:first:pt-2">
              <Stars rating={d.rating} />
              {isLiteral(d) ? (
                <figure className="mt-4">
                  <blockquote className="font-display text-subtitle text-ink">“{d.text}”</blockquote>
                  <figcaption className="mt-3 text-small text-ink-muted">{d.name}</figcaption>
                </figure>
              ) : (
                <p className="mt-4 font-display text-subtitle text-ink">{d.text}</p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
