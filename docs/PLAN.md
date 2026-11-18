# PLAN.md — Plano de execução com 4 agentes

## Visão geral
```
Fase 0  ── 01-foundation (sozinho) ─────────────► base pronta (gate G0)
Fase 1  ┬─ 02-sections  (seções com dados) ─┐
        ├─ 03-motion    (hooks + presets)   ├──► integração (gate G1)
        └─ 04-qa-launch (SEO/meta/infra)    ┘
Fase 2  ── 03-motion aplica nas seções  +  02 refina visual (impeccable/taste) ─► (gate G2)
Fase 3  ── 04-qa-launch auditoria completa → correções → deploy (gate G3)
```

## Fase 0 — Fundação (Agente 01)
1. Scaffold `pnpm create vite@latest . --template react-ts`.
2. Tailwind v4 (`tailwindcss @tailwindcss/vite`), alias `@/`.
3. `pnpm dlx shadcn@latest init`; adicionar: button, card, accordion, sheet, badge, separator, avatar.
4. Instalar: `gsap @gsap/react motion lucide-react` (+ `lenis` opcional).
5. Tokens de `SPEC.md` em `@theme`; fontes (self-host via `@fontsource-variable/*`).
6. `src/data/types.ts` + `src/data/clinica.ts` completos a partir de `CONTENT.md` (TODOs marcados).
7. `lib/whatsapp.ts`, `Section`, `Container`; `App.tsx` com as seções vazias na ordem (stubs) para os outros agentes preencherem.
**Gate G0:** `pnpm build` ok; `App.tsx` renderiza stubs; tokens e dados prontos.

## Fase 1 — Paralelo
- **02-sections:** Header, Footer, WhatsAppFab e as 9 seções, já marcadas com `data-anim` e chamando `useReveal` (pode criar stub local do hook se o 03 ainda não entregou — ver CONTRACTS). Puxa componentes React Bits pelo registry shadcn.
- **03-motion:** `lib/gsap.ts` (registro de plugins, `gsap.matchMedia` com reduced motion), `useReveal`, `useHeroIntro`, `useHeaderHide`, componentes Motion (`MotionCard`, `MagneticButton`, `FabReveal`). Testa numa rota/arquivo de playground local.
- **04-qa-launch:** meta tags, OG image, JSON-LD `Dentist`, robots/sitemap, `vercel.json` (cache headers), integração GTM + `whatsapp_click`, checklist de QA.
**Gate G1:** página completa navegável com conteúdo; hooks entregues.

## Fase 2 — Integração e polimento
- 03 liga as animações nas seções via HANDOFF (refs/attrs faltantes), ajusta timings, parallax e pin.
- 02 roda `/impeccable` e `design-taste-frontend` em cada seção e corrige hierarquia/espaçamento/tipografia.
**Gate G2:** sem regressões, animações suaves a 60fps em mobile médio.

## Fase 3 — QA e lançamento (Agente 04)
1. Lighthouse mobile (build de produção), axe, teste de teclado, reduced motion, 360/768/1024/1440px.
2. Auditoria `web-design-guidelines` + `vercel-react-best-practices`.
3. `docs/QA-REPORT.md` com achados → HANDOFF para donos dos arquivos → reteste.
4. Deploy Vercel (preview → produção) após aprovação do Davi.
**Gate G3:** critérios de aceite do SPEC 100% ✔.

## Riscos
| Risco | Mitigação |
|---|---|
| Conteúdo pendente (fotos, horários, logo) | placeholders `TODO(conteudo)`; layout não depende de quantidade fixa |
| Conflito GSAP × Motion | contrato: elementos distintos; GSAP só via hooks |
| Excesso de animação pesar no mobile | `gsap-performance`; parallax off < 768px; meta de INP |
| Conflito de arquivos entre agentes | tabela de propriedade + `HANDOFF.md` |
