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
