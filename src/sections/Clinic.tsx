import { useRef } from 'react'
import { clinica } from '@/data/clinica'
import { useReveal } from '@/hooks/useReveal'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

const { galeria } = clinica
const copy = clinica.ui.secoes.clinica

// Mosaico: a 1ª foto ocupa 2 linhas no desktop; as demais preenchem ao lado.
const tile = (index: number) =>
  index === 0 ? 'col-span-2 aspect-[4/3] lg:row-span-2 lg:aspect-auto' : 'aspect-square'

/** #clinica — galeria. Sem fotos reais em clinica.galeria, a seção não renderiza. */
export default function Clinic() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  if (galeria.length === 0) return null

  return (
    <Section ref={scope} id="clinica">
      <Container>
        <h2 data-anim="title" className="max-w-[20ch] text-title text-ink">
          {copy.titulo}
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {galeria.map((foto, index) => (
            <li key={foto.src} data-anim="scale-in" className={`overflow-hidden rounded-xl bg-surface-2 ${tile(index)}`}>
              <img
                src={foto.src}
                alt={foto.alt}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-500 ease-out-soft hover:scale-[1.03]"
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
