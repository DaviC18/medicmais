// TEMPORÁRIO (02-sections). Textos de interface e títulos de seção que ainda não existem em
// src/data/clinica.ts. Pedido aberto no docs/HANDOFF.md para o 01-foundation mover este objeto
// para `clinica.ui` (campos `secoes`, `labels`) e `clinica.hero.imagem`. Quando existir, troque os
// imports por `clinica.ui.*` e apague este arquivo.
// Copy proposta, sem promessa de resultado (CFO). TODO(conteudo): validar com a clínica.

export const pendingCopy = {
  secoes: {
    servicos: {
      titulo: 'Tratamentos odontológicos',
      intro: 'Todo tratamento começa por uma avaliação. Depois dela, o dentista explica o que encontrou e as opções para o seu caso.',
    },
    equipe: {
      titulo: 'Quem cuida de você',
    },
    clinica: {
      titulo: 'Conheça a clínica',
    },
    depoimentos: {
      titulo: 'O que os pacientes destacam',
      nota: 'Resumo das avaliações 5 estrelas publicadas no site da clínica.',
    },
    numeros: {
      titulo: 'A MedicMais em números',
    },
    faq: {
      titulo: 'Perguntas frequentes',
      intro: 'Não encontrou o que procurava? A nossa equipe responde pelo WhatsApp.',
    },
    contato: {
      titulo: 'Agende sua avaliação',
      texto: 'Envie uma mensagem pelo WhatsApp. A recepção responde para combinar o melhor dia e horário para você.',
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
    /** usado como `${n} ${estrelas}` */
    estrelas: 'de 5 estrelas',
    direitos: 'Todos os direitos reservados.',
    novaAba: '(abre em nova aba)',
  },
  imagens: {
    // TODO(conteudo): foto real (recepção ou consultório). Placeholder neutro 4:5.
    hero: {
      webp: '/images/hero-placeholder.webp',
      width: 1200,
      height: 1500,
      alt: 'Consultório odontológico da MedicMais Barra Mansa',
    },
    // TODO(conteudo): foto da Dra. Barbara. Placeholder neutro 4:5.
    equipe: {
      webp: '/images/equipe-placeholder.webp',
      width: 800,
      height: 1000,
    },
  },
} as const
