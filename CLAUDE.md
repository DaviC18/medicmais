# CLAUDE.md — MedicMais Odonto (single page)

## Projeto
Landing page single page da Odontologia da MedicMais Barra Mansa (RJ).
Objetivo único de conversão: **agendar consulta pelo WhatsApp**.
Leia sempre `docs/SPEC.md`, `docs/CONTENT.md` e `docs/CONTRACTS.md` antes de codar.

## Stack (não trocar sem pedir)
- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 via `@tailwindcss/vite` (tokens em `src/index.css` com `@theme`)
- shadcn/ui (componentes em `src/components/ui`)
- React Bits (via registry shadcn, em `src/components/reactbits`)
- GSAP + ScrollTrigger + `@gsap/react` (`useGSAP`) — scroll e timelines
- Motion (`motion/react`) — só microinterações e presença (hover, tap, AnimatePresence)
- lucide-react para ícones
- pnpm como gerenciador

## Skills instaladas — quando usar
| Skill | Use quando |
|---|---|
| `impeccable` | decisões de layout, tipografia, cor, hierarquia; rode `/impeccable` para auditar |
| `design-taste-frontend` (taste-skill) | gerar seções com cara premium, fugir do "AI slop" |
| `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance` | qualquer animação GSAP |
| `shadcn` | adicionar/compor componentes shadcn e React Bits |
| `web-design-guidelines` | auditoria final de UI/a11y |
| `vercel-react-best-practices` | performance de React / bundle |

Se `impeccable` e `taste-skill` divergirem: siga `docs/SPEC.md` (tokens e direção visual) e, no resto, priorize impeccable para regras e taste-skill para ousadia de composição.

## Regras de código
- Componentes funcionais, nomeados, um por arquivo, PascalCase.
- Nada de texto hardcoded nas seções: todo conteúdo vem de `src/data/clinica.ts`.
- Nada de cor hex solta: só tokens (`bg-brand`, `text-ink` etc.).
- Imagens: `<img>` com `width`/`height`, `loading="lazy"` (exceto hero), formatos AVIF/WebP.
- Toda animação respeita `prefers-reduced-motion` (GSAP via `gsap.matchMedia()`, Motion via `useReducedMotion`).
- GSAP nunca anima o mesmo elemento que o Motion.
- Links de WhatsApp sempre via helper `whatsappLink()` de `src/lib/whatsapp.ts`.
- Respeitar a propriedade de arquivos definida em `docs/CONTRACTS.md` — não edite arquivos de outro agente; registre pedidos em `docs/HANDOFF.md`.

## Regras de conteúdo (publicidade odontológica — CFO)
- Sempre exibir nome e CRO do responsável técnico.
- Sem promessa de resultado, sem preços/promoções, sem "o melhor/único".
- Sem fotos de antes/depois sem autorização documentada.

## Comandos
- `pnpm dev` · `pnpm build` · `pnpm preview` · `pnpm lint` · `pnpm typecheck`

## Definition of Done (qualquer tarefa)
`pnpm typecheck && pnpm lint && pnpm build` passando, sem warnings no console, responsivo de 360px a 1440px.
