import { useRef } from 'react'
import { ArrowDown, BadgeCheck, MapPin } from 'lucide-react'
import { clinica } from '@/data/clinica'
import { pendingCopy } from '@/sections/_pending-copy'
import { useHeroIntro } from '@/hooks/useHeroIntro'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { WhatsAppCta, ctaStyles } from '@/components/ui/whatsapp-cta'
import { MagneticButton } from '@/components/motion/MagneticButton'

const { hero, ui, endereco, responsavelTecnico: rt } = clinica
const foto = pendingCopy.imagens.hero

/** #inicio — headline, 2 CTAs, foto e selo da responsável técnica (CFO). */
export default function Hero() {
  const scope = useRef<HTMLElement>(null)
  useHeroIntro(scope)
  useReveal(scope) // parallax da foto (data-anim="parallax" no <img>)

  return (
    <Section
      ref={scope}
      id="inicio"
      className="overflow-hidden pt-[calc(var(--spacing-header)+2.5rem)] lg:pt-[calc(var(--spacing-header)+4.5rem)]"
    >
      <Container className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 data-anim="hero-title" className="max-w-[16ch] text-display text-ink">
            {hero.titulo}
          </h1>
          <p data-anim="hero-sub" className="mt-6 max-w-[34rem] text-lead text-ink-muted">
            {hero.subtitulo}
          </p>
          <div data-anim="hero-cta" className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticButton className="w-full sm:w-auto">
              <WhatsAppCta origem="hero" className="min-h-14 w-full px-7 sm:w-auto" />
            </MagneticButton>
            <a href="#servicos" className={`${ctaStyles.base} ${ctaStyles.quiet} min-h-14 px-7 text-body`}>
              {ui.ctaServicos}
              <ArrowDown
                className="size-4 transition-transform duration-200 ease-out-soft group-hover/cta:translate-y-0.5"
                aria-hidden="true"
            />
            </a>
          </div>
          <p data-anim="hero-cta" className="mt-8 flex items-center gap-2 text-small text-ink-muted">
            <MapPin className="size-4 shrink-0 text-brand" aria-hidden="true" />
            {endereco.bairro}, {endereco.cidade} · {endereco.uf}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:col-span-5 lg:max-w-none">
          <div
            data-anim="hero-media"
            className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-surface-2 shadow-card lg:aspect-[4/5]"
          >
            <img
              data-anim="parallax"
                src={foto.webp}
                alt={foto.alt}
                width={foto.width}
                height={foto.height}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-x-0 -top-[5%] h-[110%] w-full object-cover"
            />
          </div>

          <div
            data-anim="hero-badge"
            className="absolute -bottom-6 left-4 flex max-w-[calc(100%-2rem)] items-start gap-3 rounded-xl bg-card p-4 pr-5 shadow-lift sm:left-auto sm:-right-4 lg:-left-10 lg:right-auto"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-small font-medium text-ink">{rt.name}</span>
              <span className="block text-small text-ink-muted">
                {pendingCopy.labels.responsavelTecnica} · {rt.cro}
              </span>
            </span>
          </div>
        </div>
      </Container>
    </Section>
  )
}
