import { useRef } from 'react'
import { ArrowUpRight, Clock, MapPin, Phone } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { telLink, trackWhatsApp, whatsappLink } from '@/lib/whatsapp'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta } from '@/components/ui/whatsapp-cta'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

const { endereco, telefone, whatsapp, horarios, ui } = clinica
const copy = ui.secoes.contato
const { labels } = ui

/** #contato — CTA final em painel navy + endereço, telefone, horários (se houver) e mapa lazy. */
export default function Contact() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <Section ref={scope} id="contato">
      <Container>
        <div
          data-anim="scale-in"
          className="grid gap-10 overflow-hidden rounded-3xl bg-ink px-6 py-12 text-surface sm:px-12 sm:py-16 lg:grid-cols-12 lg:items-end lg:px-16 lg:py-20"
        >
          <div className="lg:col-span-8">
            <h2 className="max-w-[16ch] text-title text-surface">{copy.titulo}</h2>
            <p className="mt-5 max-w-[38rem] text-lead text-surface/80">{copy.texto}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <WhatsAppCta origem="contato" className="min-h-14 w-full px-7 sm:w-auto" />
            <a
              href={telLink()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-small font-medium text-surface/90 underline-offset-4 hover:text-surface hover:underline"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span className="flex flex-wrap justify-center gap-x-1.5">
                <span>{ui.ctaLigar}</span>
                <span className="whitespace-nowrap tabular-nums">{telefone}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <dl data-anim="stagger" className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 xl:grid-cols-2">
            <div className="bg-card p-6 sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <dt className="flex items-center gap-2 text-small font-medium text-ink-muted">
                <MapPin className="size-4 text-brand" aria-hidden="true" />
                {labels.endereco}
              </dt>
              <dd className="mt-2 text-ink">
                <address className="not-italic">
                  {endereco.rua}
                  <br />
                  {endereco.bairro} · {endereco.cidade} · {endereco.uf}
                  <br />
                  <span className="tabular-nums">{endereco.cep}</span>
                </address>
                <a
                  href={endereco.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-small font-medium text-brand underline-offset-4 hover:underline"
                >
                  {ui.ctaComoChegar}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only"> {labels.novaAba}</span>
                </a>
              </dd>
            </div>

            <div className="bg-card p-6">
              <dt className="flex items-center gap-2 text-small font-medium text-ink-muted">
                <Phone className="size-4 text-brand" aria-hidden="true" />
                {labels.telefone}
              </dt>
              <dd className="mt-2">
                <a href={telLink()} className="text-ink tabular-nums underline-offset-4 hover:underline">
                  {telefone}
                </a>
              </dd>
            </div>
            <div className="bg-card p-6">
              <dt className="flex items-center gap-2 text-small font-medium text-ink-muted">
                <WhatsAppIcon className="size-4 text-brand" />
                {labels.whatsapp}
              </dt>
              <dd className="mt-2">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp('contato')}
                  className="text-ink tabular-nums underline-offset-4 hover:underline"
                >
                  {whatsapp}
                  <span className="sr-only"> {labels.novaAba}</span>
                </a>
              </dd>
            </div>

            {horarios.length > 0 && (
              <div className="bg-card p-6 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <dt className="flex items-center gap-2 text-small font-medium text-ink-muted">
                  <Clock className="size-4 text-brand" aria-hidden="true" />
                  {labels.horarios}
                </dt>
                <dd className="mt-2">
                  <ul className="grid gap-1">
                    {horarios.map((h) => (
                      <li key={h.dias} className="flex justify-between gap-4 text-ink">
                        <span>{h.dias}</span>
                        <span className="tabular-nums">{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          <div data-anim="fade-up" className="overflow-hidden rounded-xl border border-line bg-surface-2 lg:col-span-7">
            <iframe
              src={endereco.mapsEmbed}
              title={labels.mapaTitulo}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0 lg:aspect-auto lg:h-full lg:min-h-80"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
