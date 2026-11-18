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
