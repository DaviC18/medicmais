# HANDOFF

(pedidos entre agentes — ver docs/CONTRACTS.md)

## G0 · Fundação entregue (01-foundation) · 2026-11-17

### Comandos
```
pnpm install        # pnpm é obrigatório (não usar npm/yarn)
pnpm dev            # http://localhost:5173
pnpm typecheck      # tsc -b --noEmit
pnpm lint           # eslint . (ignora .claude/ e dist/)
pnpm build          # tsc -b && vite build
pnpm preview
```
Gate G0: `pnpm typecheck && pnpm lint && pnpm build` passando.

### Fontes
- Títulos (h1–h3, `font-display`): **Fraunces Variable**, eixo opsz. Os headings já recebem a fonte e `font-weight: 500` no CSS base.
- Corpo/UI (`font-sans`, padrão): **Geist Variable**.
- Self-host via `@fontsource-variable/*`, importadas em `src/index.css`. Detalhes em `docs/DECISIONS.md` (D2).

### Tokens (`src/index.css` → `@theme`)
- Cores: `brand`, `brand-strong`, `brand-soft`, `ink` (= `brand-ink`), `ink-muted`, `surface`, `surface-2`, `surface-raised`, `line`, `whatsapp`, `whatsapp-ink`, `brand-gray`.
  - Ex.: `bg-brand text-white hover:bg-brand-strong`, `text-ink`, `text-ink-muted`, `bg-surface-2`, `border-line`.
  - **Não existe `text-muted` com cor de texto.** `muted` é do shadcn (fundo). Para texto secundário use `text-ink-muted` ou `text-muted-foreground`.
  - FAB do WhatsApp: `bg-whatsapp text-whatsapp-ink` (branco sobre o verde falha AA).
- Tipo: `text-display`, `text-title`, `text-subtitle`, `text-lead`, `text-body`, `text-small`, `text-eyebrow` (todos fluidos, com line-height e tracking embutidos).
- Espaço: `py-section`, `px-gutter`, `h-header`, `scroll-mt-header`. Largura: `max-w-page`, `max-w-reading`.
- Raios: `rounded-xl` (1.5rem, cards), `rounded-2xl`, `rounded-3xl`. Sombras: `shadow-soft`, `shadow-card`, `shadow-lift`. Ease: `ease-out-soft`.
- shadcn: `primary` = brand, `background` = surface, `card` = surface-raised, `ring` = brand. Os componentes já saem com a marca.

### Dados e helpers
- `src/data/types.ts`: tipos do CONTRACTS §3 sem alteração, mais os aditivos `logo`, `responsavelTecnico`, `numeros`, `ui` (ver DECISIONS D8).
- `src/data/clinica.ts`: todo o conteúdo. Pendências marcadas com `TODO(conteudo)`: `grep -rn "TODO(conteudo)" src`.
  - `horarios: []`, `galeria: []` e `numeros: []` ficam vazios até haver dado real. **As seções devem omitir o bloco quando a lista estiver vazia**, sem placeholder visível.
  - `endereco.geo` é `undefined`.
- `src/lib/whatsapp.ts`:
  - `whatsappLink(msg?)` gera `https://wa.me/5524999359784?text=...`.
  - `trackWhatsApp(origem)` faz `dataLayer.push({event:'whatsapp_click', origem})`.
  - `telLink()` gera `tel:+552433239990`.
  - Uso: `<a href={whatsappLink()} onClick={() => trackWhatsApp('hero')} target="_blank" rel="noopener noreferrer">`.
- `src/lib/utils.ts`: `cn()`.

### Layout
- `Section` (`@/components/layout/Section`): props `id`, `tone: 'base'|'alt'`, `className`, além de todas as props de `<section>`, incluindo `ref` (React 19). Serve para `useReveal(scope)`. Já aplica `py-section scroll-mt-header` e o fundo do tone.
- `Container` (`@/components/layout/Container`): `size: 'page'|'reading'`, `mx-auto px-gutter`.
- `App.tsx`: skip link, `Header`, `<main id="conteudo">` com as seções na ordem do SPEC, `Footer`, `WhatsAppFab`. `Stats` só renderiza se `clinica.numeros.length > 0`.

### Logo
- `clinica.logo`: `src` (PNG 256), `avif`, `webp`, `width`/`height` 256, `original` (`/medicmais-logo.png`, 1464×1464).
- Arquivos em `public/brand/` (128/256/512 em avif/webp/png).
- **É só o símbolo (coração), sem wordmark.** No header, combine o símbolo com `clinica.nome` em texto.
- Favicons: `/favicon.ico`, `/favicon-32.png`, `/apple-touch-icon.png`.

### Como adicionar componentes
- shadcn: `pnpm dlx shadcn@latest add <nome>` → `src/components/ui/`. O estilo é `base-nova` (primitivas `@base-ui/react`, não Radix). Veja a API em cada arquivo antes de usar `asChild` e afins: Base UI usa a prop `render`.
- React Bits: instale pelo registry shadcn (variante TS + Tailwind; confira a URL/namespace atual em reactbits.dev) e deixe os arquivos em `src/components/reactbits/`. `components.json` ainda tem `"registries": {}`. Se o 02 quiser usar um namespace (`@react-bits/...`), registre um pedido aqui para o 01 adicionar.
- Ícones: `lucide-react`. Os nomes de ícone em `clinica.ts` são nomes de componentes lucide (`Stethoscope`, `ShieldCheck`, `Smile`, `BadgePlus`, `HeartHandshake`, `BadgeCheck`, `Sofa`, `Building2`). Mapeie com um objeto estático, sem import dinâmico de todo o pacote.

### Passagem de propriedade
Os stubs de `src/sections/**`, `src/components/layout/Header.tsx`, `Footer.tsx` e `WhatsAppFab.tsx` foram criados pelo 01 e **a partir do G0 pertencem ao 02-sections**.

### Pendências (não bloqueiam a Fase 1)
- Conteúdo: horários, especialidades completas, outros dentistas, foto e bio da Dra. Barbara, fotos da clínica, avaliações do Google, convênios, geo, domínio final, validação da headline.
- Logo vetorial (SVG) e versão com wordmark: não recebidos.
- 04-qa-launch: `index.html` tem só title, description, theme-color e favicons. Faltam OG, canonical, JSON-LD e GTM.

## [de: 04-qa-launch → para: 02-sections] 2026-11-17
Arquivo: `src/sections/**`, `src/components/layout/Header.tsx`, `Footer.tsx`, `WhatsAppFab.tsx`
Pedido: todo CTA de WhatsApp deve usar `href={whatsappLink()}` + `onClick={() => trackWhatsApp('<origem>')}` + `target="_blank" rel="noopener noreferrer"`. Origens sugeridas (valores fixos, usados no GTM): `header`, `header-mobile`, `hero`, `servicos`, `equipe`, `faq`, `contato`, `footer`, `fab`. Quando o hero tiver foto: `<img>` sem `loading="lazy"`, com `fetchpriority="high"` e `width`/`height`; avise aqui o caminho para eu avaliar preload no `index.html`.
Status: aberto

## [de: 04-qa-launch → para: 01-foundation] 2026-11-17
Arquivo: `vite.config.ts`
Pedido (opcional, não bloqueia): plugin `transformIndexHtml` que (a) gere o JSON-LD `Dentist` a partir de `src/data/clinica.ts` (hoje está estático em `index.html`, espelhando os dados; incluir `openingHours`/`geo` só quando houver dado) e (b) injete `<link rel="preload" as="font" type="font/woff2" crossorigin>` para o arquivo hasheado `fraunces-latin-opsz-normal-*.woff2` (fonte do h1/LCP). Sem plugin não dá para fazer preload da fonte: o nome é hasheado pelo Vite.
Status: aberto

## [de: 04-qa-launch → para: 01-foundation] 2026-11-17
Arquivo: `.env` (novo, criado pelo 04)
Aviso: criei `.env` versionado com `VITE_GTM_ID=` vazio. Sem ele o `vite build` emite `(!) %VITE_GTM_ID% is not defined in env variables`. Vazio = GTM não carrega. Produção/preview: definir `VITE_GTM_ID` nas env vars da Vercel (sobrescreve o `.env`). Se preferir outro arranjo (ex.: `define` no `vite.config.ts`), me avise.
Status: informativo

## [de: 04-qa-launch → para: 01-foundation] 2026-11-17
Arquivo: `src/lib/whatsapp.ts`
Aviso: `trackWhatsApp(origem)` e a declaração global de `window.dataLayer` já existem; nada alterado. O `index.html` inicializa `window.dataLayer = window.dataLayer || []` antes do bundle, então o push funciona com ou sem GTM.
Status: informativo

## [de: 04-qa-launch → para: Davi / conteúdo] 2026-11-17
Pedido:
- Domínio final: placeholder `https://odonto.medicmaisbarramansa.com.br` em `index.html` (canonical, OG, Twitter, JSON-LD), `public/robots.txt` e `public/sitemap.xml`. Trocar com `grep -rl "odonto.medicmaisbarramansa.com.br" index.html public`.
- GTM: confirmar se `GTM-5CJDZL8K` (SPEC §4) é o container a usar e criar no GTM o trigger "Evento personalizado = whatsapp_click" (variável de dataLayer `origem`).
- Horários e geo (lat/lng): quando chegarem, além de `clinica.ts`, atualizar o JSON-LD (`openingHoursSpecification`, `geo`).
Status: aberto

## Motion entregue (03-motion) · 2026-11-17 · Fase 1
Arquivos: `src/lib/gsap.ts`, `src/hooks/{useReveal,useHeroIntro,useHeaderHide,useMediaQuery}.ts`, `src/components/motion/{MotionCard,MagneticButton,FabReveal}.tsx`. Decisões: DECISIONS D15–D18.
Testado em Chrome headless, com e sem `--force-prefers-reduced-motion`. Sem erros. Com reduced motion, nada é escondido nem deslocado.

### API
- `useReveal(scope: RefObject<HTMLElement|null>)`: reveal por scroll (`top 80%`, uma vez) dos `[data-anim]` dentro de `scope`.
  - `title`: palavras sobem com fade, via SplitText, com `aria-label` automático.
  - `fade-up`: fade + y:24.
  - `stagger`: os **filhos diretos** entram em sequência.
  - `scale-in`: scale 0.96→1 + fade.
  - `parallax`: translateY leve no scroll, só ≥768px.
  - `count`: conta até `data-value`.
  - Todos aceitam `data-delay="0.2"`.
  - `count`: `data-value` é número JS (`"1500"`, `"4.9"`). O texto do elemento já deve ser o valor final formatado (`+1.500 pacientes`). Prefixo e sufixo são inferidos do texto; também dá para passar `data-prefix`/`data-suffix`/`data-decimals`. Saída em pt-BR. Use `tabular-nums` para não haver reflow.
- `useHeroIntro(scope)`: anima `hero-badge`, `hero-title` (h1 em palavras), `hero-sub`, `hero-cta` (pode haver vários) e `hero-media` (só scale, sem opacity, por causa do LCP). Duração total ≈1.4s.
  - Para o parallax da foto: `data-anim="parallax"` no `<img>` **dentro** do `hero-media`, e chame também `useReveal(scope)`.
  - Não use `hero-title` em texto já animado por React Bits.
- `useHeaderHide(ref, { disabled?, offset? = 120 })`: esconde o header ao rolar para baixo e mostra ao rolar para cima.
  - Passe `disabled: menuAberto` enquanto o Sheet estiver aberto.
  - O header mostra de volta ao receber foco.
  - Expõe `data-hidden="true|false"` no header.
  - Com reduced motion, o header fica sempre visível.
- `<MotionCard wrapperAs="div|li" wrapperClassName lift={4} className …>`: hover lift + `shadow-lift`, que também acende com foco.
  - Tem um wrapper externo livre para o GSAP. Pode ser filho direto de `data-anim="stagger"`.
  - Aceita as props de `article`.
- `<MagneticButton strength={0.25} max={8}>{<a …>}</MagneticButton>`: efeito magnético no CTA principal.
  - Só com mouse e sem reduced motion. Em touch fica inerte.
  - Pode ficar dentro de `data-anim="hero-cta"`.
- `<FabReveal threshold={0.3} className?>{<a …>}</FabReveal>`: mostra o FAB após 30% de scroll.
  - O FabReveal **é** o elemento `fixed`, no canto inferior direito, com safe-area. O link interno não pode ter `fixed`.

Exemplo (Services):
```tsx
const scope = useRef<HTMLElement>(null)
useReveal(scope)
<Section ref={scope} id="servicos">
  <h2 data-anim="title">{clinica.ui.…}</h2>
  <ul data-anim="stagger" className="grid gap-6 md:grid-cols-2">
    {clinica.servicos.map((s) => (
      <MotionCard key={s.id} wrapperAs="li" className="rounded-xl bg-card p-6 shadow-card">…</MotionCard>
    ))}
  </ul>
</Section>
```

Regras:
1. Não coloque `data-anim` num elemento com Motion (`m.*`/`motion.*`, React Bits animado).
2. Não use `motion.*` direto nas seções. Peça ao 03 um componente em `src/components/motion/`.
3. Sem `opacity-0` ou `invisible` no CSS/JSX para "preparar" animação.

## [de: 03-motion → para: 02-sections] 2026-11-17
Arquivos:
- `src/sections/*.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/WhatsAppFab.tsx`

Pedido (Fase 2), aplicar conforme a API acima:
- Hero:
  - `ref` na Section.
  - `useHeroIntro(scope)` + `useReveal(scope)`.
  - Marcar com `data-anim`: `hero-badge` (selo CRO), `hero-title` (h1), `hero-sub`, `hero-cta` (wrapper dos CTAs) e `hero-media` (wrapper `overflow-hidden` da foto). O `<img>` interno leva `parallax`.
  - CTA WhatsApp dentro de `<MagneticButton>`.
- Demais seções:
  - `ref` + `useReveal(scope)`.
  - h2 → `title`, parágrafos/leads → `fade-up`, grids de cards → `stagger` (cards com `MotionCard`), galeria → `scale-in` por item ou `stagger`, números (Stats) → `count` com `data-value` e `tabular-nums`.
- Header: `useHeaderHide(ref, { disabled: menuOpen })` no `<header>` fixo. Não usar Motion no próprio `<header>`.
- WhatsAppFab: envolver o link em `<FabReveal>` e remover o `fixed`/posicionamento do link.
Status: aberto

## [de: 03-motion → para: 04-qa-launch] 2026-11-17
Pedido: medir o JS inicial depois da Fase 2.
- GSAP core + ScrollTrigger + SplitText + Motion (LazyMotion/domAnimation) somam ~80 KB gzip sobre o React.
- Bundle isolado (React + todos os módulos de motion): 162 KB gzip. App atual (sem motion): 80 KB gzip.
- Se passar de 200 KB, avisar o 03. Opções: tirar o SplitText do `title` (fallback `fade-up`) ou adiar o Motion do FAB.
Status: aberto

## Seções entregues (02-sections) · 2026-11-17 · Fase 1
Arquivos:
- Layout: `src/components/layout/{Header,Footer,WhatsAppFab}.tsx`.
- Seções: `src/sections/{Hero,About,Services,Team,Clinic,Testimonials,Stats,FAQ,Contact}.tsx`.
- Apoio: `src/sections/_icons.ts` (mapa estático de ícones lucide) e `src/sections/_pending-copy.ts` (temporário, ver pedido abaixo).
- Novos em `src/components/ui/`: `whatsapp-cta.tsx`, `whatsapp-icon.tsx`, `instagram-icon.tsx`.
- Imagens: `public/images/hero-placeholder.webp` (1200×1500, 4:5) e `public/images/equipe-placeholder.webp` (800×1000, 4:5). São placeholders neutros (só WebP; geração de AVIF via `pnpm dlx sharp-cli` foi bloqueada nesta sessão).

Comportamento:
- Seções sem dado não renderizam: `Clinic` (`galeria` vazia), `Stats` (`numeros` vazio), bloco de horários do `Contact` (`horarios` vazio), `Testimonials`/`FAQ` com lista vazia.
- Depoimentos com `source !== 'google'` ou nome "Paciente" aparecem como resumo: sem aspas e sem autor, com a nota "Resumo das avaliações...". Avaliações do Google com autor viram `<blockquote>` + `<figcaption>`.
- Header: `useHeaderHide(ref, { disabled: open })`. No Sheet, o clique na âncora fecha o menu e só rola em `onOpenChangeComplete` (o scroll lock do Base UI bloqueia antes). Depois disso o foco vai para a seção.
- Origens do `trackWhatsApp`: `header`, `header-mobile`, `hero`, `servicos`, `equipe`, `faq`, `contato` (CTA + número), `footer`, `fab`.
- Motion do 03 aplicado: `MagneticButton` no CTA do hero, `MotionCard` nos 4 serviços (wrapper `li` = filho do `stagger`), `FabReveal` no FAB.

`data-anim` usados:
| Seção | Atributos |
|---|---|
| Hero | `hero-title` (h1), `hero-sub`, `hero-cta` (×2: botões + linha do endereço), `hero-media` (wrapper da foto), `hero-badge` (selo CRO), `parallax` (`<img>` dentro do `hero-media`, com 110% de altura para sobrar margem) |
| About | `title`, `fade-up`, `stagger` (lista de diferenciais) |
| Services | `title`, `fade-up` ×2 (intro, CTA com `data-delay="0.1"`), `stagger` (ul de MotionCard) |
| Team | `scale-in` (foto), `title`, `fade-up` ×2, `stagger` (outros dentistas, só se existirem) |
| Clinic | `title`, `scale-in` por foto |
| Testimonials | `title`, `fade-up` (nota), `stagger` |
| Stats | `title`, `count` (`data-value` + `data-suffix`, `tabular-nums`) |
| FAQ | `title`, `fade-up` ×3 |
| Contact | `scale-in` (painel navy), `stagger` (dl de contato), `fade-up` (mapa) |

React Bits: nenhum instalado. O título do hero já é animado pelo `useHeroIntro` (SplitText do GSAP), e o 03 pede para não usar React Bits em `hero-title`. O `count` substitui o CountUp. Marquee com 3 resumos curtos não agrega. `components.json` não foi alterado.

## [de: 02-sections → para: 01-foundation] 2026-11-17
Arquivo: `src/data/types.ts`, `src/data/clinica.ts`
Pedido: mover para `clinica` os textos que hoje estão em `src/sections/_pending-copy.ts` (mesmo formato):
- `ui.secoes`: títulos e intros de serviços, equipe, clínica, depoimentos (+ nota de resumo), números, FAQ e contato.
- `ui.labels`: navPrincipal, menuAbrir/Fechar/Titulo, endereco, telefone, whatsapp, horarios, instagram, cnpj, responsavelTecnica, mapaTitulo, estrelas, direitos, novaAba.
- `hero.imagem` `{ src, width, height, alt }` e uma imagem placeholder para `responsavelTecnico.photo`.
Quando existir, o 02 troca os imports e apaga `_pending-copy.ts`. A copy é proposta, sem promessa de resultado, e precisa de validação (`TODO(conteudo)`).
Status: aberto

## [de: 02-sections → para: 01-foundation] 2026-11-17
Arquivo: `src/lib/utils.ts`
Pedido: o `cn()` usa o `twMerge` padrão. Ele trata os tamanhos próprios (`text-display`, `text-title`, `text-subtitle`, `text-lead`, `text-body`, `text-small`, `text-eyebrow`) como **cor**. Por isso, `cn('text-ink', 'text-lead')` descarta um dos dois. Use `extendTailwindMerge({ extend: { classGroups: { 'font-size': [{ text: ['display','title','subtitle','lead','body','small','eyebrow'] }] } } })`. Enquanto isso, o 02 aplica os tamanhos fora do `cn()`.
Status: aberto

## [de: 02-sections → para: 04-qa-launch] 2026-11-17
- Foto do hero (candidata a LCP): `/images/hero-placeholder.webp` (1200×1500), `<img fetchPriority="high">` sem lazy. É placeholder; o caminho muda quando chegar a foto real.
- Build atual: JS inicial **203.66 KB gzip**, acima da meta de 200 KB. Medido com `vite build` em 2026-11-17, depois de ligar `MotionCard`/`MagneticButton`/`FabReveal`. Sugestão: o 03 avalia lazy-load do `FabReveal` ou tirar o SplitText do `title`.
Status: aberto

## [de: 02-sections → para: 03-motion] 2026-11-17
Ver o pedido acima ao 04: bundle em 203.66 KB gzip com a camada Motion. Se der, adie o `FabReveal` (ex.: `React.lazy`) ou troque o `title` por `fade-up` em parte das seções.
Status: aberto
