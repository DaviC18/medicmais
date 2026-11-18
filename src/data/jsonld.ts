// JSON-LD (schema.org/Dentist) gerado a partir de clinica.ts.
// Roda só no build/dev server: importado por vite.config.ts (plugin `clinicaHtml`), que
// substitui o marcador <!-- clinica:jsonld --> do index.html. Não entra no bundle do app.
// Imports com extensão .ts: este arquivo também é checado pelo tsconfig.node.json (nodenext).

import { clinica } from './clinica.ts'
import type { Clinica, TeamMember } from './types.ts'

/** "(24) 3323-9990" → "+55-24-3323-9990" */
function telefoneE164ish(exibicao: string): string {
  return `+55-${exibicao.replace(/\D+/g, ' ').trim().split(/\s+/).join('-')}`
}

/** "CRO-RJ 42247" → { propertyID: "CRO-RJ", value: "42247" } */
function registro(cro: string) {
  const i = cro.lastIndexOf(' ')
  return {
    '@type': 'PropertyValue',
    propertyID: i > 0 ? cro.slice(0, i) : cro,
    value: i > 0 ? cro.slice(i + 1) : cro,
  }
}

function pessoa(m: TeamMember) {
  return { '@type': 'Person', name: m.name, jobTitle: m.role, identifier: registro(m.cro) }
}

export function dentistJsonLd(c: Clinica = clinica): Record<string, unknown> {
  const base = c.seo.siteUrl.replace(/\/?$/, '/')
  const abs = (path: string) => new URL(path.replace(/^\//, ''), base).toString()
  const equipe = c.equipe.map(pessoa)

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${base}#dentist`,
    name: `${c.nome} – Odontologia`,
    alternateName: c.nome,
    slogan: c.slogan,
    description: c.seo.descricao,
    url: base,
    image: abs(c.seo.imagem),
    logo: abs(c.seo.logo),
    telephone: telefoneE164ish(c.telefone),
    taxID: c.cnpj,
    medicalSpecialty: 'https://schema.org/Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${c.endereco.rua} - ${c.endereco.bairro}`,
      addressLocality: c.endereco.cidade,
      addressRegion: c.endereco.uf,
      postalCode: c.endereco.cep,
      addressCountry: 'BR',
    },
    ...(c.endereco.geo && {
      geo: { '@type': 'GeoCoordinates', latitude: c.endereco.geo.lat, longitude: c.endereco.geo.lng },
    }),
    // TODO(conteudo): `horarios` é texto livre ({ dias, horas }). Quando chegar o horário real,
    // acrescentar openingHoursSpecification aqui (dias/horas estruturados).
    hasMap: c.endereco.mapsLink,
    areaServed: { '@type': 'City', name: c.endereco.cidade },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: telefoneE164ish(c.whatsapp),
      availableLanguage: 'pt-BR',
    },
    employee: equipe.length === 1 ? equipe[0] : equipe,
    sameAs: [c.instagram],
  }
}

/** Bloco <script> pronto para o <head>. `<` escapado para não fechar o script. */
export function dentistJsonLdScript(c: Clinica = clinica): string {
  const json = JSON.stringify(dentistJsonLd(c), null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}
