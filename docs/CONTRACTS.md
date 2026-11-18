# CONTRACTS.md — Contratos entre agentes

Objetivo: permitir que os agentes trabalhem em paralelo sem conflito de arquivos.

## 1. Propriedade de arquivos
| Agente | É dono de (pode criar/editar) |
|---|---|
| 01-foundation | `package.json`, configs (`vite.config.ts`, `tsconfig*`, `components.json`, eslint), `index.html` (estrutura), `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/data/**`, `src/lib/utils.ts`, `src/lib/whatsapp.ts`, `src/components/layout/Section.tsx`, `src/components/layout/Container.tsx`, `src/components/ui/**` (instalação inicial) |
| 02-sections | `src/sections/**`, `src/components/layout/Header.tsx`, `Footer.tsx`, `WhatsAppFab.tsx`, `src/components/reactbits/**`, novos `src/components/ui/**`, `public/images/**` |
| 03-motion | `src/lib/gsap.ts`, `src/hooks/**`, `src/components/motion/**` |
| 04-qa-launch | `index.html` (meta/SEO/JSON-LD), `public/robots.txt`, `public/sitemap.xml`, `public/og-image.*`, `vercel.json`, `docs/QA-REPORT.md` |

Precisa mudar arquivo de outro agente? Escreva o pedido em `docs/HANDOFF.md` (formato abaixo) e siga em frente.

```
## [de: 03-motion → para: 02-sections] 2026-11-18
Arquivo: src/sections/Hero.tsx
Pedido: adicionar ref container + data-anim="hero-title" no h1.
Status: aberto | feito
```

## 2. Contrato de animação (02-sections ↔ 03-motion)
As seções **não** importam GSAP diretamente. Elas marcam elementos e chamam o hook:

```tsx
// em cada seção
const scope = useRef<HTMLElement>(null)
useReveal(scope)            // hook do Agente 3
<section ref={scope} id="servicos"> 
  <h2 data-anim="title">…</h2>
  <div data-anim="stagger">{cards}</div>
  <img data-anim="parallax" … />
</section>
```

Valores de `data-anim` suportados:
| valor | efeito |
|---|---|
| `title` | split/fade-up do título |
| `fade-up` | fade + y:24 |
| `stagger` | filhos diretos entram em sequência |
| `parallax` | translateY leve no scroll (desligado no mobile) |
| `scale-in` | scale 0.96→1 + fade |
| `count` | número conta até `data-value` |
Atributo opcional: `data-delay="0.2"`.

Hero tem timeline própria: `useHeroIntro(scope)` com `data-anim="hero-*"` (`hero-title`, `hero-sub`, `hero-cta`, `hero-media`, `hero-badge`).

Microinterações com Motion ficam em `src/components/motion/` (`MotionCard`, `MagneticButton`, `FabReveal`) e são usadas pelo 02-sections. Até existirem, 02 usa componentes normais.

## 3. Contrato de dados
`src/data/types.ts` (Agente 1) define:
```ts
export type Service = { id: string; title: string; description: string; icon: string }
export type Testimonial = { name: string; text: string; rating: 1|2|3|4|5; source?: 'google'|'site' }
export type TeamMember = { name: string; role: string; cro: string; photo?: string; bio?: string }
export type FaqItem = { q: string; a: string }
export type Clinica = {
  nome: string; slogan: string; cnpj: string
  endereco: { rua: string; bairro: string; cidade: string; uf: string; cep: string; mapsEmbed: string; mapsLink: string; geo?: {lat:number; lng:number} }
  telefone: string; whatsapp: string; whatsappMsg: string; instagram: string
  horarios: { dias: string; horas: string }[]
  hero: { titulo: string; subtitulo: string }
  sobre: { texto: string; diferenciais: { titulo: string; texto: string; icon: string }[] }
  servicos: Service[]; equipe: TeamMember[]; depoimentos: Testimonial[]; faq: FaqItem[]
  galeria: { src: string; alt: string }[]
}
```

## 4. Helpers
- `whatsappLink(msg?: string): string` — monta `https://wa.me/<num>?text=<encoded>`.
- `trackWhatsApp(origem: string)` — `window.dataLayer?.push({event:'whatsapp_click', origem})`.
- `cn()` — shadcn.
