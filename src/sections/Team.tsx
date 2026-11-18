import { useRef } from 'react'
import { BadgeCheck } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'

const { equipe, responsavelTecnico: rt } = clinica
const copy = clinica.ui.secoes.equipe
const placeholder = clinica.placeholders.equipe
// Demais dentistas (a responsável técnica já é o destaque).
const outros = equipe.filter((membro) => membro.cro !== rt.cro)

/** #equipe — responsável técnica em destaque (nome + CRO obrigatórios, CFO). */
export default function Team() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <Section ref={scope} id="equipe" tone="alt">
      {/* Mobile: título → foto → dados. lg: foto à esquerda ocupando as 2 linhas; título e dados à direita. */}
      <Container className="grid gap-x-16 gap-y-10 lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-y-0">
        <h2 data-anim="title" className="text-title text-ink lg:col-span-6 lg:col-start-7 lg:row-start-2">
          {copy.titulo}
        </h2>

        <figure
          data-anim="scale-in"
          className="w-full max-w-[20rem] sm:max-w-sm lg:col-span-5 lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:max-w-none"
        >
          <img
            src={rt.photo ?? placeholder.src}
            alt={`${rt.name}, ${rt.role}`}
            width={placeholder.width}
            height={placeholder.height}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full rounded-3xl bg-surface object-cover shadow-card"
          />
        </figure>

        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-3 lg:self-start">
          <div data-anim="fade-up" className="border-t border-ink/12 pt-8 lg:mt-10">
            <h3 className="text-subtitle text-ink">{rt.name}</h3>
            <p className="mt-1.5 text-ink-muted">{rt.role}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/12 bg-card px-4 py-2 text-small font-medium text-ink tabular-nums">
              <BadgeCheck className="size-4 text-brand" aria-hidden="true" />
              {rt.cro}
            </p>
            {rt.bio && <p className="mt-8 max-w-reading text-lead text-ink">{rt.bio}</p>}
          </div>

          {outros.length > 0 && (
            <ul data-anim="stagger" className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {outros.map((membro) => (
                <li key={membro.cro} className="border-t border-ink/12 py-5">
                  <p className="font-medium text-ink">{membro.name}</p>
                  <p className="text-small text-ink-muted">
                    {membro.role} · {membro.cro}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div data-anim="fade-up" className="mt-10">
            <WhatsAppCta origem="equipe" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
