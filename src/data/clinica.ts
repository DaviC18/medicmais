// Fonte da verdade: docs/CONTENT.md (levantado em 17/11/2026).
// Pendências marcadas com TODO(conteudo) — não inventar dados (números, nomes, fotos).
// Regras CFO: sem promessa de resultado, sem preços/promoções, sem "o melhor/único".

import type { Clinica, TeamMember } from './types.ts'

const enderecoCompleto = 'Praça das Nações Unidas, 60 - Ano Bom, Barra Mansa - RJ, 27323-360'

const responsavelTecnico: TeamMember = {
  name: 'Dra. Barbara Daniela Domingueti Dias',
  role: 'Cirurgiã-dentista · Responsável técnica',
  cro: 'CRO-RJ 42247',
  photo: undefined, // TODO(conteudo): foto da Dra. Barbara
  bio: undefined, // TODO(conteudo): frase/apresentação aprovada pela profissional
}

export const clinica: Clinica = {
  nome: 'MedicMais Barra Mansa',
  slogan: 'Nós cuidamos de você e da sua família',
  cnpj: '43.812.444/0001-34',

  endereco: {
    rua: 'Praça das Nações Unidas, 60',
    bairro: 'Ano Bom',
    cidade: 'Barra Mansa',
    uf: 'RJ',
    cep: '27323-360',
    mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&output=embed`,
    mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`,
    geo: undefined, // TODO(conteudo): lat/lng exatos (pino do Google Maps) para JSON-LD
  },

  // Formato de exibição. Links: telLink() / whatsappLink() em src/lib/whatsapp.ts
  telefone: '(24) 3323-9990',
  whatsapp: '(24) 99935-9784',
  whatsappMsg: 'Olá! Vim pelo site e gostaria de agendar uma consulta odontológica.',
  instagram: 'https://www.instagram.com/medicmaisbarramansa/',

  // TODO(conteudo): horário de funcionamento. Lista vazia = seção Contato omite o bloco.
  horarios: [],

  hero: {
    // Headline do site atual: "Transforme seu Sorriso com a MedicMais" — evitada por soar
    // como promessa de resultado (CFO). TODO(conteudo): validar headline com a clínica.
    titulo: 'Cuidado odontológico para você e toda a sua família',
    subtitulo:
      'Atendimento humanizado, com acolhimento e responsabilidade, no Ano Bom, em Barra Mansa. Agende sua avaliação pelo WhatsApp.',
    // TODO(conteudo): foto real (recepção ou consultório), AVIF/WebP. Placeholder neutro 4:5.
    // Candidata a LCP: ao trocar o arquivo, avisar o 04 (preload no index.html).
    imagem: {
      src: '/images/hero-placeholder.webp',
      width: 1200,
      height: 1500,
      alt: 'Consultório odontológico da MedicMais Barra Mansa',
    },
  },

  sobre: {
    texto:
      'Na MedicMais, cuidamos de pessoas, não só da saúde bucal. Cada atendimento começa com acolhimento, respeito e empatia, e segue de forma personalizada e responsável, com profissionais habilitados. Nosso ambiente foi estruturado para oferecer conforto, segurança e ética, seguindo as normas dos órgãos reguladores.',
    diferenciais: [
      {
        titulo: 'Atendimento humanizado',
        texto: 'Escuta atenta, respeito e empatia em cada consulta, do primeiro contato ao acompanhamento.',
        icon: 'HeartHandshake',
      },
      {
        titulo: 'Profissionais habilitados',
        texto: 'Atendimento personalizado e responsável, conduzido por profissionais com registro no conselho.',
        icon: 'BadgeCheck',
      },
      {
        titulo: 'Ambiente confortável',
        texto: 'Espaço estruturado para conforto, segurança e ética, seguindo as normas dos órgãos reguladores.',
        icon: 'Sofa',
      },
      {
        titulo: 'Tudo no mesmo endereço',
        texto: 'Clínica médica, odontológica e de exames no Ano Bom, para cuidar da família em um só lugar.',
        icon: 'Building2',
      },
    ],
  },

  // TODO(conteudo): lista completa de especialidades odontológicas (destaque "Dentistas"/"Especialidades").
  servicos: [
    {
      id: 'clinico-geral',
      title: 'Clínico geral',
      description: 'Avaliações, orientações e acompanhamento da sua saúde bucal.',
      icon: 'Stethoscope',
    },
    {
      id: 'prevencao-diagnostico',
      title: 'Prevenção e diagnóstico',
      description: 'Consultas de rotina para identificar cedo o que precisa de cuidado e orientar a prevenção.',
      icon: 'ShieldCheck',
    },
    {
      id: 'proteses',
      title: 'Próteses dentárias',
      description: 'Indicadas após avaliação profissional, de acordo com a necessidade de cada paciente.',
      icon: 'Smile',
    },
    {
      id: 'implantes',
      title: 'Implantes dentários',
      description: 'Indicados após avaliação clínica, com cada etapa explicada antes de começar.',
      icon: 'BadgePlus',
    },
  ],

  // TODO(conteudo): demais dentistas da equipe (nome + CRO + foto).
  equipe: [responsavelTecnico],

  // TODO(conteudo): substituir por avaliações reais do Google (texto literal + nome/inicial, source: 'google').
  // Os textos abaixo resumem as 3 avaliações 5★ do site atual.
  depoimentos: [
    { name: 'Paciente', text: 'Atendimento humanizado e preço justo.', rating: 5, source: 'site' },
    { name: 'Paciente', text: 'Excelência no atendimento e uma clínica muito bonita.', rating: 5, source: 'site' },
    { name: 'Paciente', text: 'Clínica bonita e confortável.', rating: 5, source: 'site' },
  ],

  faq: [
    {
      // TODO(conteudo): lista de convênios aceitos (se houver).
      q: 'Vocês aceitam convênio odontológico?',
      a: 'Fale com a nossa equipe pelo WhatsApp e informe o seu plano. Explicamos as formas de atendimento disponíveis antes de você agendar.',
    },
    {
      q: 'Como faço para agendar minha primeira consulta?',
      a: 'Pelo WhatsApp: toque em qualquer botão de agendamento, envie a mensagem que já vem pronta e nossa equipe responde para combinar o melhor dia e horário. Se preferir, ligue para a recepção.',
    },
    {
      q: 'O que acontece na primeira consulta?',
      a: 'É uma avaliação clínica. O dentista conversa sobre o seu histórico, examina a boca com calma e explica o que encontrou. Qualquer tratamento só é indicado depois dessa avaliação.',
    },
    {
      q: 'Colocar implante dói?',
      a: 'O procedimento é feito com anestesia local e só é indicado após avaliação clínica. Na consulta, o dentista explica cada etapa, os cuidados e o que esperar no seu caso.',
    },
    {
      q: 'Quanto tempo dura um tratamento com prótese ou implante?',
      a: 'Depende de cada caso. O prazo e as etapas são definidos pelo profissional depois da avaliação e explicados antes de qualquer procedimento.',
    },
    {
      q: 'A clínica também tem atendimento médico e exames?',
      a: 'Sim. A MedicMais reúne clínica médica, odontológica e de exames no mesmo endereço, no Ano Bom, em Barra Mansa.',
    },
  ],

  // TODO(conteudo): 4–6 fotos reais da clínica (recepção, consultórios, fachada) em public/images/ (AVIF/WebP).
  galeria: [],

  // --- aditivos ---
  logo: {
    src: '/brand/medicmais-logo-256.png',
    avif: '/brand/medicmais-logo-256.avif',
    webp: '/brand/medicmais-logo-256.webp',
    alt: 'MedicMais Barra Mansa',
    width: 256,
    height: 256,
    original: '/medicmais-logo.png',
  },

  responsavelTecnico,

  // Só preencher com dado real (anos, pacientes). Vazio = seção não renderiza.
  numeros: [],

  seo: {
    // TODO(conteudo): domínio final. Mesmo placeholder do index.html, robots.txt e sitemap.xml (D10).
    siteUrl: 'https://odonto.medicmaisbarramansa.com.br/',
    descricao:
      'Atendimento odontológico humanizado para você e sua família no Ano Bom, em Barra Mansa (RJ): clínico geral, prevenção e diagnóstico, próteses e implantes dentários após avaliação.',
    imagem: '/og-image.jpg',
    logo: '/brand/medicmais-logo-512.png',
  },

  placeholders: {
    // TODO(conteudo): foto da Dra. Barbara (responsavelTecnico.photo). Placeholder neutro 4:5;
    // a foto real deve manter a proporção 4:5 (as dimensões abaixo são usadas no <img>).
    equipe: { src: '/images/equipe-placeholder.webp', width: 800, height: 1000 },
  },

  ui: {
    skipLink: 'Pular para o conteúdo',
    nav: [
      { label: 'Início', href: '#inicio' },
      { label: 'Sobre', href: '#sobre' },
      { label: 'Serviços', href: '#servicos' },
      { label: 'Equipe', href: '#equipe' },
      { label: 'Dúvidas', href: '#faq' },
      { label: 'Contato', href: '#contato' },
    ],
    ctaWhatsapp: 'Agendar pelo WhatsApp',
    ctaServicos: 'Ver serviços',
    ctaAgendarAvaliacao: 'Agendar avaliação',
    ctaLigar: 'Ligar para a clínica',
    ctaComoChegar: 'Como chegar',

    // TODO(conteudo): copy proposta pelo 02-sections (sem promessa de resultado, CFO);
    // validar títulos e intros com a clínica.
    secoes: {
      servicos: {
        titulo: 'Tratamentos odontológicos',
        intro:
          'Todo tratamento começa por uma avaliação. Depois dela, o dentista explica o que encontrou e as opções para o seu caso.',
      },
      equipe: { titulo: 'Quem cuida de você' },
      clinica: { titulo: 'Conheça a clínica' },
      depoimentos: {
        titulo: 'O que os pacientes destacam',
        nota: 'Resumo das avaliações 5 estrelas publicadas no site da clínica.',
      },
      numeros: { titulo: 'A MedicMais em números' },
      faq: {
        titulo: 'Perguntas frequentes',
        intro: 'Não encontrou o que procurava? A nossa equipe responde pelo WhatsApp.',
      },
      contato: {
        titulo: 'Agende sua avaliação',
        texto:
          'Envie uma mensagem pelo WhatsApp. A recepção responde para combinar o melhor dia e horário para você.',
      },
    },

    labels: {
      navPrincipal: 'Navegação principal',
      menuAbrir: 'Abrir menu',
      menuFechar: 'Fechar menu',
      menuTitulo: 'Menu',
      endereco: 'Endereço',
      telefone: 'Telefone',
      whatsapp: 'WhatsApp',
      horarios: 'Horários',
      instagram: 'Instagram',
      cnpj: 'CNPJ',
      responsavelTecnica: 'Responsável técnica',
      mapaTitulo: 'Mapa com a localização da MedicMais Barra Mansa',
      estrelas: 'de 5 estrelas',
      direitos: 'Todos os direitos reservados.',
      novaAba: '(abre em nova aba)',
    },
  },
}
