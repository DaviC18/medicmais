// Contrato de dados — docs/CONTRACTS.md §3.
// Os tipos do contrato estão abaixo sem alterações. Campos marcados como
// "aditivo" foram acrescentados pelo 01-foundation (ver docs/DECISIONS.md)
// e não quebram nada do contrato original.

export type Service = { id: string; title: string; description: string; icon: string }
export type Testimonial = { name: string; text: string; rating: 1 | 2 | 3 | 4 | 5; source?: 'google' | 'site' }
export type TeamMember = { name: string; role: string; cro: string; photo?: string; bio?: string }
export type FaqItem = { q: string; a: string }

/** aditivo: logo da marca (símbolo do coração, sem wordmark). */
export type Logo = {
  /** fallback PNG (256x256) */
  src: string
  avif: string
  webp: string
  alt: string
  width: number
  height: number
  /** arquivo original em alta resolução (1464x1464) */
  original: string
}

/** aditivo: item de navegação por âncora. */
export type NavItem = { label: string; href: `#${string}` }

/** aditivo: número da seção "numeros" — só com dado real. */
export type Stat = { value: number; suffix?: string; label: string }

/** aditivo: imagem com dimensões intrínsecas (evita CLS). */
export type Imagem = { src: string; width: number; height: number; alt: string }

/** aditivo: título (e textos de apoio) de uma seção. */
export type SecaoText = { titulo: string; intro?: string }

/** aditivo: textos de interface (labels de CTA, navegação, acessibilidade). */
export type UiText = {
  skipLink: string
  nav: NavItem[]
  ctaWhatsapp: string
  ctaServicos: string
  ctaAgendarAvaliacao: string
  ctaLigar: string
  ctaComoChegar: string
  /** títulos e intros das seções */
  secoes: {
    servicos: SecaoText & { intro: string }
    equipe: SecaoText
    clinica: SecaoText
    /** `nota`: aviso exibido quando os depoimentos são resumos (não citações literais) */
    depoimentos: SecaoText & { nota: string }
    numeros: SecaoText
    faq: SecaoText & { intro: string }
    contato: SecaoText & { texto: string }
  }
  /** rótulos curtos e textos de acessibilidade */
  labels: {
    navPrincipal: string
    menuAbrir: string
    menuFechar: string
    menuTitulo: string
    endereco: string
    telefone: string
    whatsapp: string
    horarios: string
    instagram: string
    cnpj: string
    responsavelTecnica: string
    mapaTitulo: string
    /** usado como `${n} ${estrelas}` */
    estrelas: string
    direitos: string
    /** sufixo sr-only de links externos */
    novaAba: string
  }
}

export type Clinica = {
  nome: string; slogan: string; cnpj: string
  endereco: { rua: string; bairro: string; cidade: string; uf: string; cep: string; mapsEmbed: string; mapsLink: string; geo?: { lat: number; lng: number } }
  telefone: string; whatsapp: string; whatsappMsg: string; instagram: string
  horarios: { dias: string; horas: string }[]
  hero: { titulo: string; subtitulo: string; /** aditivo */ imagem: Imagem }
  sobre: { texto: string; diferenciais: { titulo: string; texto: string; icon: string }[] }
  servicos: Service[]; equipe: TeamMember[]; depoimentos: Testimonial[]; faq: FaqItem[]
  galeria: { src: string; alt: string }[]

  // --- aditivos (01-foundation) ---
  logo: Logo
  /** responsável técnica da odontologia — obrigatório exibir (CFO) */
  responsavelTecnico: TeamMember
  /** vazio = seção "numeros" não renderiza */
  numeros: Stat[]
  /** dados de SEO usados no JSON-LD (gerado no build por vite.config.ts → src/data/jsonld.ts) */
  seo: {
    /** URL canônica com barra final */
    siteUrl: string
    /** description do JSON-LD (Dentist) */
    descricao: string
    /** caminhos absolutos a partir de public/ */
    imagem: string
    logo: string
  }
  /** imagens neutras usadas enquanto não há foto real (ex.: equipe sem `photo`) */
  placeholders: { equipe: Omit<Imagem, 'alt'> }
  ui: UiText
}
