import { clinica } from '@/data/clinica'

// STUB (01-foundation). Dono a partir do G0: 02-sections.
// CFO: rodapé final precisa exibir CNPJ + responsável técnica + CRO.
export default function Footer() {
  const { responsavelTecnico: rt } = clinica
  return (
    <footer className="bg-surface-2 py-8 text-small text-ink-muted">
      <div className="mx-auto max-w-page px-gutter">
        {rt.name} · {rt.cro}
      </div>
    </footer>
  )
}
