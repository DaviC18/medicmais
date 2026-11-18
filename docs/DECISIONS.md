# DECISIONS

(decisões de design/tech registradas pelos agentes)

## 2026-11-17 · 01-foundation

### D1 · Gerenciador de pacotes: pnpm
O scaffold inicial foi instalado com npm (`package-lock.json`). Removido o lockfile e o `node_modules`, reinstalado com pnpm 12 (`pnpm-lock.yaml`). A dependência `cn` (pacote npm sem relação com o helper do shadcn) não era importada em lugar nenhum e foi removida. `shadcn` permanece em `dependencies` porque `src/index.css` importa `shadcn/tailwind.css` (só CSS, não entra no bundle JS).

### D2 · Tipografia: Fraunces (display) + Geist (corpo)
- **Display (h1–h3):** Fraunces Variable, eixo `opsz` (`@fontsource-variable/fraunces/opsz.css`, 67 KB latin). Serifa calorosa e humana, com optical sizing automático: nos tamanhos de título usa o corte de display, de alto contraste. Atende o "limpa, humana, calorosa, não template de dentista azul" do SPEC. Peso padrão 500. O eixo `SOFT`/`WONK` (arquivo `full`, 121 KB) ficou de fora por peso.
- **Corpo/UI:** Geist Variable (`wght`, 29 KB latin). Sans neutra, muito legível em mobile, com números claros (telefone e CEP).
- Self-host via `@fontsource-variable/*`, `font-display: swap`. pt-BR fica coberto pelo subset `latin`: o navegador baixa só os subsets usados, via `unicode-range`.
- Tokens: `font-display` (Fraunces) e `font-sans` (Geist). O `--font-heading` do shadcn aponta para Fraunces.

### D3 · Escala tipográfica fluida (360px → 1440px)
| Utilitário | Tamanho | Line-height | Tracking | Papel |
|---|---|---|---|---|
| `text-display` | 40 → 76px | 1.04 | -0.028em | headline do hero (h1) |
| `text-title` | 32 → 52px | 1.1 | -0.02em | títulos de seção (h2) |
| `text-subtitle` | 22 → 28px | 1.25 | -0.01em | títulos de card (h3) |
| `text-lead` | 18 → 22px | 1.55 | — | subtítulos e intro de seção |
| `text-body` | 16 → 17px | 1.65 | — | corpo (padrão do `body`) |
| `text-small` | 14px | 1.5 | — | metadados, rodapé |
| `text-eyebrow` | 13px | 1.4 | 0.12em | rótulo acima do título (usar `uppercase`) |
Os nomes são próprios para não sobrescrever `text-xl` e afins do Tailwind. Headings recebem `text-wrap: balance` e parágrafos `text-wrap: pretty`. Texto corrido deve ficar em `max-w-reading` (40rem, cerca de 65ch).

### D4 · Espaçamento e larguras
- `py-section`: 64 → 128px (fluido). `px-gutter`: 20 → 40px (fluido).
- `h-header` / `scroll-mt-header`: 4.5rem. O `html` também usa `scroll-padding-top` com esse valor.
- `max-w-page`: 76rem (1216px). `max-w-reading`: 40rem.

### D5 · Cores
- `--color-brand` passou de `#D7263D` (provisório do SPEC) para **`#DC1E2A`**, a cor amostrada do coração no logo oficial (`public/medic+logo.png`). O SPEC manda ajustar quando o logo chegar. Contraste: branco sobre brand = 4.9:1; brand sobre surface = 4.65:1 (AA).
- `--color-brand-strong #B5141F` (hover), `--color-brand-soft #FBE8E9` (tint).
- O SPEC define `--color-muted` (texto secundário), mas esse nome **colide com o `bg-muted` do shadcn** (usado 11x nos componentes como fundo). Ele foi renomeado para **`--color-ink-muted`** (`text-ink-muted`, `#5B6475`). O `--muted-foreground` do shadcn usa esse mesmo valor. Contraste sobre surface-2: 5.1:1.
- `--color-ink` é um alias curto de `--color-brand-ink` (`#14213D`), para escrever `text-ink`.
- O logo não tem navy: é um coração vermelho com cinza `#5E5E5E` (`--color-brand-gray`, só decorativo). O navy do SPEC foi mantido para texto.
- `--color-whatsapp #25D366`: **branco sobre esse verde não passa AA (~2:1)**. Use `--color-whatsapp-ink #0A2E18` para ícone/texto sobre o verde (7.5:1).
- Mapeamento shadcn: background=surface, foreground=ink, card/popover=surface-raised `#FFFDFA`, primary=brand, secondary/muted/accent=surface-2, border/input=line `#E6DED3`, ring=brand. O bloco `.dark` e as variáveis sidebar/chart foram removidos, porque a página não tem dark mode.

### D6 · Raios e sombras
`--radius: 0.875rem` (sm/md/lg derivados). `rounded-xl` = 1.5rem (SPEC, cards), `rounded-2xl` = 2rem, `rounded-3xl` = 2.5rem. Sombras `shadow-soft`, `shadow-card` e `shadow-lift` levam tom navy em baixa opacidade, nunca preto puro. A curva `ease-out-soft` (`cubic-bezier(0.22,1,0.36,1)`) serve para transições CSS/Motion.

### D7 · Logo e favicon
- Os PNGs recebidos (`public/medic+logo.png` 1464×1464 transparente; `public/medic_logo_aba1.png` 250×250 em círculo branco) trazem **só o símbolo do coração, sem o wordmark "MedicMais"**. O header precisa compor o símbolo com o nome em texto (`clinica.nome`).
- O "+" no nome do arquivo vira espaço em alguns contextos de URL. Por isso foi criada a cópia **`public/medicmais-logo.png`** (idêntica) e os originais foram mantidos.
- Versões otimizadas em `public/brand/`: `medicmais-logo-{128,256,512}.{avif,webp,png}`. WebP gerado com Pillow; AVIF com `pnpm dlx sharp-cli` (q60). `clinica.logo` aponta para as versões de 256px. Use `<picture>` com AVIF → WebP → PNG.
- Favicon: gerado a partir de `medic_logo_aba1.png` (o fundo branco circular funciona em abas escuras). Arquivos: `favicon.ico` (16/32/48), `favicon-32.png` e `apple-touch-icon.png` (180). O `favicon.svg` e o `icons.svg` do template Vite foram removidos (o SPEC cita `favicon.svg`; não há logo vetorial ainda).

### D8 · Contrato de dados: campos aditivos
Os tipos de CONTRACTS §3 foram mantidos sem alteração. Foram **acrescentados** a `Clinica`:
- `logo`;
- `responsavelTecnico` (CFO; também é `equipe[0]`);
- `numeros: Stat[]` (vazio = a seção Stats não renderiza);
- `ui` (skip link, navegação e labels de CTA), para cumprir a regra "nada de texto hardcoded".

`telefone` e `whatsapp` ficam em formato de exibição. Os links saem de `telLink()` / `whatsappLink()`.

### D9 · Copy com cuidado CFO
- A headline atual ("Transforme seu Sorriso...") soa como promessa de resultado. O hero usa "Cuidado odontológico para você e toda a sua família", marcado com `TODO(conteudo)` para validação.
- O FAQ não traz preços nem promessas. Implante e prótese aparecem sempre "após avaliação". Convênio fica sem lista, com encaminhamento ao WhatsApp.
- Depoimentos: os 3 do site entram como resumo (`name: 'Paciente'`, `source: 'site'`), marcados com TODO para trocar por avaliações reais do Google.

## 2026-11-17 · 04-qa-launch

### D10 · Domínio placeholder
Domínio final pendente (CONTENT.md). Placeholder único `https://odonto.medicmaisbarramansa.com.br`, usado em `index.html`, `public/robots.txt` e `public/sitemap.xml`, marcado com `TODO(conteudo)`. Troca: `grep -rl "odonto.medicmaisbarramansa.com.br" index.html public`.

### D11 · GTM condicionado a env var
O loader do GTM é um script inline no `<head>` com `%VITE_GTM_ID%` (substituição nativa do Vite no HTML, sem mexer no `vite.config.ts`). Só carrega `gtm.js` se o valor casar `^GTM-[A-Z0-9]+$`; caso contrário não há request. `.env` versionado traz `VITE_GTM_ID=` vazio (evita o warning de variável indefinida no build); a Vercel define o valor real. `window.dataLayer` é sempre criado, então `trackWhatsApp()` funciona sem GTM. O `<noscript>` do GTM foi omitido: a página é um SPA que não funciona sem JS, e o iframe com ID ausente faria um request inválido.

### D12 · JSON-LD estático
`Dentist` estático em `index.html`, espelhando `clinica.ts` (pedido de plugin no HANDOFF). Responsável técnica como `employee` (`Person` + `identifier` `CRO-RJ 42247`), `taxID` = CNPJ, `contactPoint` com o WhatsApp. Sem `openingHours` e `geo` até haver dado real.

### D13 · Cache e segurança (vercel.json)
`/assets/*` (hasheado): `max-age=31536000, immutable`. HTML e demais rotas: `max-age=0, must-revalidate`. Estáticos não hasheados (`/brand`, `/images`, favicons, og-image): 7 dias + `stale-while-revalidate`. Headers: nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, HSTS. CSP adiada até fechar os tags do GTM.

### D14 · OG image
`public/og-image.jpg` 1200×630 (55 KB), gerada com Pillow a partir de `public/brand/medicmais-logo-512.png`, usando Fraunces (opsz) e Geist dos `@fontsource-variable` locais e as cores dos tokens: painel com o símbolo à esquerda, "Odontologia · Barra Mansa (RJ)", nome, slogan e "Agende sua avaliação pelo WhatsApp".

## 2026-11-17 · 03-motion

### D15 · GSAP centralizado e reduced motion
`src/lib/gsap.ts` registra ScrollTrigger, SplitText e `useGSAP` uma vez e define defaults `power3.out` / 0.8s. Todo efeito GSAP fica dentro de `gsap.matchMedia()` com `(prefers-reduced-motion: no-preference)`. O parallax também exige `(min-width: 768px)`. O estado "escondido" vem só do JS, via `gsap.from` no useLayoutEffect do `useGSAP`, antes do paint. O HTML/CSS sempre traz o estado final, então nada some se o JS falhar ou se o usuário pediu menos movimento. Só transform/opacity.

### D16 · Hero sem atrasar o LCP
`hero-media` não recebe opacity, só `scale 1.04→1`. Assim a imagem pinta no primeiro frame. O h1 é dividido em palavras com SplitText e revertido para texto puro ao fim. A timeline dura cerca de 1.4s.

### D17 · Motion enxuto (LazyMotion)
Os componentes de `src/components/motion/` usam `LazyMotion` + `m` + `domAnimation`, e não `motion.*`. Medido num bundle isolado (React + GSAP + ST + SplitText + Motion): 177 KB → 162 KB gzip. Fica proibido `motion.*` direto nas seções. Microinteração nova deve virar componente em `src/components/motion/`.

### D18 · Lenis: não usar
Ficou de fora. O scroll nativo já é suave o bastante para uma landing de conteúdo. Lenis acrescenta ~4 KB gzip e um rAF permanente no main thread, o que piora o INP em celular médio. Também exige sincronia com `ScrollTrigger.update` e quebra o `scroll-behavior` nativo das âncoras e o comportamento de reduced motion. Revisitar só se o 02 pedir scroll "amanteigado" e o Lighthouse/INP tiver folga.

## 2026-11-17 · 02-sections

### D-S1 · Composição das seções
- Layouts assimétricos em 12 colunas. Em Serviços e FAQ, o título fica fixo (sticky) à esquerda. Os cards de serviço ficam em colunas desencontradas (`even:mt-14`). Diferenciais e depoimentos usam lista editorial com filetes, sem grade de cards. Os depoimentos formam o momento tipográfico da página: serifa grande e sem cards. O CTA final fica num painel navy.
- Sem eyebrow acima dos títulos (o craft-floor do impeccable proíbe). O token `text-eyebrow` não é usado.
- Um único estilo de botão: pílula. Vermelho da marca para o WhatsApp, contorno navy para ação secundária, `min-h-12`/`min-h-14` (alvo de toque). O FAB mantém o verde do WhatsApp com `whatsapp-ink`.
- Ícone do WhatsApp: SVG próprio (path do Simple Icons). O lucide 1.x não tem ícones de marca. O do Instagram também é um SVG próprio.

### D-S2 · React Bits: nenhum componente instalado
O texto do hero já é animado pelo `useHeroIntro`, e o contrato do 03 proíbe React Bits em `hero-title`. O `data-anim="count"` substitui o CountUp. Um marquee com 3 resumos curtos seria ruído. Por isso o registry não foi adicionado ao `components.json`, e a exceção autorizada pelo coordenador ficou sem uso.

### D-S3 · Textos de UI temporários
Os títulos de seção e os rótulos de acessibilidade que não existem em `clinica.ts` ficam em `src/sections/_pending-copy.ts`, até o 01 movê-los para `clinica.ui` (pedido no HANDOFF). A regra "nada de texto hardcoded nos componentes" continua valendo, porque nenhum JSX tem string literal.

## 2026-11-17 · 01-foundation (Fase 2)

### D19 · JSON-LD e preload da fonte via plugin Vite
- `vite.config.ts` tem o plugin `clinicaHtml` (`transformIndexHtml`, ordem normal, para ter `ctx.bundle` no build).
- JSON-LD: `src/data/jsonld.ts` monta o `Dentist` a partir de `clinica` e substitui o marcador `<!-- clinica:jsonld -->` do `index.html`, em dev e no build. O resultado foi comparado com o bloco estático do 04 (D12): JSON idêntico. Sem o marcador o build falha, para não publicar sem dados estruturados.
- Derivações: telefone `(24) 3323-9990` → `+55-24-3323-9990`; CRO `CRO-RJ 42247` → `PropertyValue` (`CRO-RJ` / `42247`); `employee` é objeto com 1 dentista e array com mais. `geo` entra quando `clinica.endereco.geo` existir. `openingHoursSpecification` fica de fora até haver horário real: `horarios` é texto livre (TODO no `jsonld.ts`).
- Campos de SEO sem lugar no contrato foram para o aditivo `clinica.seo` (`siteUrl`, `descricao`, `imagem`, `logo`). Canonical, OG e Twitter continuam estáticos no `index.html` (04). O domínio placeholder agora também está em `clinica.seo.siteUrl`.
- Preload: só no build, `<link rel="preload" as="font" type="font/woff2" crossorigin>` para `fraunces-latin-opsz-normal-<hash>.woff2` (h1/LCP). O build falha se o arquivo não for encontrado (ex.: troca de fonte ou de subset).
- `clinica.ts` importa `./types.ts` com extensão: o arquivo também é checado pelo `tsconfig.node.json` (`module: nodenext`), que exige extensão em imports relativos.
- No dev, mudanças em `clinica.ts` reiniciam o servidor (dependência do config) e o JSON-LD é refeito.

### D20 · Copy de UI em `clinica.ui`
O conteúdo de `src/sections/_pending-copy.ts` (02) foi movido. Aditivos novos no tipo `Clinica`:
- `ui.secoes` (títulos e intros das seções) e `ui.labels` (rótulos e textos de acessibilidade);
- `hero.imagem: Imagem` (`{ src, width, height, alt }`);
- `placeholders.equipe` (`{ src, width, height }`). `responsavelTecnico.photo` segue `undefined`; a seção Equipe usa o placeholder como fallback. A foto real deve manter 4:5, porque as dimensões do `<img>` vêm do placeholder.
A copy proposta pelo 02 foi marcada com `TODO(conteudo)` para validação.

### D21 · `cn()` com tokens próprios
`src/lib/utils.ts` usa `extendTailwindMerge` com o `theme` do tailwind-merge v3: `text` (display, title, subtitle, lead, body, small, eyebrow), `spacing` (section, gutter, header), `container` (page, reading), `shadow` (soft, card, lift) e `ease` (out-soft). Cores custom não precisam de registro: o padrão do v3 já aceita qualquer nome de cor. Regra: todo token novo dessas famílias no `@theme` deve ser acrescentado aqui.

## 2026-11-17 · 03-motion (Fase 2)

### D22 · Motion fora do JS inicial
`MotionCard` e `MagneticButton` passaram a usar `motion/react-m` + `<LazyMotion features={loadMotionFeatures} strict>`. As features (`domAnimation`) vêm num chunk próprio via `import()`.
- Sem features, um `m.*` renderiza como elemento comum. O card e o CTA aparecem no 1º paint, e o hover/tap liga depois.
- Nenhum deles usa `initial`, então não há estado escondido esperando o chunk.
- O `MagneticButton` trocou `useMotionValue`/`useSpring`, que puxavam o motor de animação para o bundle inicial, por `animate={{x,y}}` com transição spring. A atualização é limitada a 1 por frame.
- O `FabReveal` virou um shell sem Motion. `FabRevealMotion` é carregado (junto com as features) em `requestIdleCallback` após o `load`, ou no 1º scroll. Ele usa um listener de scroll passivo no lugar do `useScroll`.
- Se algum chunk falhar: o FAB cai num container fixo estático (sempre visível) e os `m.*` ficam estáticos, sem rejeição não tratada.
- Alternativa avaliada e não adotada: `React.lazy` do card e do botão inteiros. Economizaria mais ~12 kB gzip, mas troca o nó do CTA do hero depois do paint (pode perder foco ou hover).

### D23 · ScrollTrigger sob demanda + vendors separados
`loadScrollTrigger()` (memoizado) importa, registra e configura o ScrollTrigger. `useReveal` e `useHeaderHide` esperam essa promise.
- Como o plugin chega depois do 1º paint, `useReveal` não anima o que já está na tela ou acima dela (`isSeen`). Isso evita esconder conteúdo que o usuário já está vendo, inclusive com link direto para uma âncora.
- O parallax vale para tudo. A foto do hero, a ≥768px, fica praticamente no ponto neutro no topo da página.
- O SplitText e o core continuam síncronos, porque o intro do hero roda antes do paint.
- `vite.config.ts` ganhou `codeSplitting.groups`: `react` (react, react-dom, scheduler) e `gsap` (sem ScrollTrigger/Observer). Isso tirou o aviso de 500 kB sem mexer em `chunkSizeWarningLimit` e dá cache longo aos vendors.
- Resultado: JS inicial de 204.05 → 165.91 kB gzip.

### D24 · Hero: h1 visível no 1º frame abaixo de 1024px
Com o h1 dividido em palavras e com `autoAlpha: 0`, o Chrome descartava o h1 como LCP: cada palavra vira um bloco pequeno, invisível no 1º frame. A 360px, o LCP virava o subtítulo, em ~590 ms.
- Abaixo de `MQ_HERO_WIDE` (1024px), o h1 só assenta em y (`0.25em → 0`, sem opacity), e o LCP volta a ser o h1 em ~150 ms.
- A partir de 1024px a foto é o LCP e o split por palavras continua.

### D25 · Ritmo e custo de layout
- O `stagger` limita a sequência total a 0.48 s (`PRESETS.stagger.maxTotal`).
- `useReveal` lê todos os `getBoundingClientRect` antes da primeira escrita de estilo.
- Trace de scroll com CPU 4× (360 e 1440): 0 layouts forçados por JS e 0 tasks acima de 50 ms. Animações seguem só em transform/opacity.
- Lenis continua fora (D18).


## 2026-11-17 · 02-sections (Fase 2)

### D26 · Serviços: um painel com linhas no lugar de quatro cards
- Os 4 serviços viraram linhas de um único painel (`rounded-xl bg-card shadow-soft`, divisórias `divide-line`): título com ícone à esquerda e descrição à direita (≥640px). Abaixo disso, a descrição fica sob o título, com a largura toda.
- Motivo: os cards com `MotionCard` subiam no hover sem serem links, o que sugeria um clique que não existe. A grade de cards iguais com ícone, título e texto é o padrão genérico que o impeccable recusa. A coluna desencontrada (`even:mt-14`) também deixava espaço vazio dentro dos cards.
- `MotionCard` continua em `src/components/motion/` para um card que seja link. Nenhuma seção o usa hoje.
- `data-anim="stagger"` agora fica na `<ul>` do painel. Os filhos animados são os `<li>`.

### D27 · Menu mobile carregado sob demanda
- O conteúdo do menu (Popup, Portal, Backdrop e o gerenciador de foco do Base UI) saiu do JS inicial e foi para `src/components/ui/mobile-menu.tsx`. O `Header` usa `Dialog.Root` e `Dialog.Trigger` direto de `@base-ui/react/dialog`, e o `sheet.tsx` só entra no chunk do menu.
- O chunk é importado na primeira intenção: hover ou foco no botão, ao abrir, ou no ocioso após o `load` (só abaixo de 1280px). Ele só é renderizado depois de importado, guardado em estado.
- Não use `React.lazy` + `Suspense` aqui. Com o Popup dentro de um `Suspense`, o Tab saía do menu para o skip link (teste no Chrome headless). Com o componente guardado em estado, o foco fica preso como na versão síncrona.
- Se o usuário tocar antes de o chunk chegar, o Root abre e o Popup aparece quando o chunk carrega. O foco vai para "Fechar menu" (testado com o chunk atrasado 1,5 s).
- Resultado: JS inicial de 165.91 para 158.91 kB gzip. O chunk `mobile-menu` tem 8.93 kB gzip. O valor inclui a saída do `MotionCard`.

### D28 · Ajustes de composição e ritmo
- Nav inline e CTA no header só a partir de `xl` (1280px). Entre 1024 e 1279px, o nome da marca ficava truncado ("MedicMais Barr..."). Abaixo de `xl`, o header usa o menu.
- Rodapé: 12 colunas só a partir de `xl` e 3 colunas a partir de `md`. Antes, em 1024px, o endereço quebrava em "Unidas, / 60". O `pb-28` vale em todas as larguras, para o FAB não cobrir o CNPJ.
- Equipe: no DOM, o h2 vem antes da foto. No mobile a ordem fica título, foto e dados. No `lg`, a foto ocupa as linhas da grade e o título e os dados ficam centralizados à direita.
- Selo do hero: nome, "Responsável técnica" e CRO em 3 linhas. O CRO usa `whitespace-nowrap`. Antes, "CRO-RJ / 42247" quebrava no mobile.
- "Ligar para a clínica" e o telefone ficam em dois trechos com `flex-wrap`, sem o "·" sobrando no fim da linha. O número não quebra.
- Contato: endereço em 3 linhas (rua; bairro, cidade e UF; CEP), igual ao rodapé. A lista de contato e o mapa ficam com a mesma altura no `lg`.
- FAQ: a pergunta ganha sublinhado no hover (o trigger não tinha resposta ao ponteiro).
- O título do menu ("Menu") usa a fonte sans, porque é um rótulo e não um título editorial.
