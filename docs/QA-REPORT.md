# QA-REPORT — MedicMais Odonto

Dono: 04-qa-launch. Status: **checklist preparado na Fase 1, auditoria ainda não executada** (Fase 3).

Legenda: `[ ]` pendente · `[x]` ok · `[!]` falhou (ver Achados) · `n/a` não se aplica.

## 0. Ambiente de teste
- Build: `pnpm build && pnpm preview` (build de produção, nunca `pnpm dev`).
- Lighthouse: Chrome DevTools ou `pnpm dlx lighthouse <url> --preset=desktop` / padrão mobile; 3 execuções, registrar a mediana.
- Larguras: 360, 390, 768, 1024, 1440 px.
- Data / commit / URL testada: _preencher na Fase 3_.

## 1. Infra entregue na Fase 1 (04-qa-launch)
| Item | Arquivo | Status |
|---|---|---|
| `lang="pt-BR"`, title (57 car.), description (151 car.), canonical, robots, theme-color | `index.html` | [x] |
| Open Graph + Twitter `summary_large_image` | `index.html` | [x] |
| JSON-LD `Dentist` (nome, endereço, telefones, CNPJ, responsável técnica + CRO, sameAs Instagram; sem `openingHours`/`geo` até haver dado) | `index.html` | [x] JSON válido |
| GTM condicionado a `VITE_GTM_ID` (sem ID = nenhum request) | `index.html`, `.env` | [x] testado headless nos dois casos |
| `window.dataLayer` sempre inicializado; tipo global declarado | `index.html`, `src/lib/whatsapp.ts` (01) | [x] |
| `robots.txt`, `sitemap.xml` | `public/` | [x] |
| `og-image.jpg` 1200×630 | `public/og-image.jpg` | [x] 55 KB |
| Cache: `/assets/*` imutável 1 ano; HTML `max-age=0, must-revalidate`; estáticos não hasheados 7 dias | `vercel.json` | [x] |
| Headers de segurança (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS) | `vercel.json` | [x] |
| Preload da fonte display e da imagem do hero | — | [ ] bloqueado (ver HANDOFF) |
| CSP | — | n/a por ora: GTM injeta tags arbitrárias; avaliar CSP depois de fechar os tags do container |

### Placeholders a trocar antes da produção
- Domínio `https://odonto.medicmaisbarramansa.com.br` (TODO(conteudo)): `grep -rl "odonto.medicmaisbarramansa.com.br" index.html public`.
- `VITE_GTM_ID`: definir na Vercel (SPEC cita `GTM-5CJDZL8K`; confirmar com a clínica).
- `openingHours` e `geo` no JSON-LD quando `clinica.horarios` / `clinica.endereco.geo` forem preenchidos.
- `sitemap.xml` `<lastmod>` na data do deploy.

## 2. Critérios de aceite (SPEC §5)
| # | Critério | Como verificar | Status |
|---|---|---|---|
| 1 | Todas as seções renderizam com dados de `clinica.ts` | inspeção visual + `grep` por texto hardcoded em `src/sections` | [ ] |
| 2 | Todo CTA abre WhatsApp com mensagem pré-preenchida e dispara `whatsapp_click` | clicar cada CTA com `window.dataLayer` aberto no console; conferir `origem`; GTM Preview/Tag Assistant | [ ] |
| 3 | Nenhum link `https://#` ou botão morto | `grep -rn 'href="#"\|https://#' src dist`; varrer `<a>`/`<button>` sem ação | [ ] |
| 4 | Responsável técnica + CRO no rodapé e na seção equipe | visual | [ ] |
| 5 | Menu mobile funciona; âncoras rolam com offset do header | teclado + toque em 360/390 px | [ ] |
| 6 | Animações desligam com reduced motion; sem CLS causado por animação | DevTools > Rendering > `prefers-reduced-motion: reduce`; Lighthouse CLS | [ ] |
| 7 | Metas Lighthouse no build de produção (mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO = 100; LCP < 2.5 s; CLS < 0.1; JS inicial < 200 KB gzip) | Lighthouse mobile + desktop | [ ] |
| 8 | `impeccable` e `web-design-guidelines` sem itens críticos | rodar as skills | [ ] |

## 3. Checklist detalhado

### 3.1 Performance
- [ ] Lighthouse mobile: Perf __ · A11y __ · BP __ · SEO __ · LCP __ · CLS __ · TBT __
- [ ] Lighthouse desktop: Perf __ · A11y __ · BP __ · SEO __
- [ ] JS inicial gzip < 200 KB (saída do `vite build`). Referência Fase 1: `index-*.js` 79.98 KB gzip (seções ainda stub).
- [ ] Imagens: AVIF/WebP, `width`/`height`, `loading="lazy"` fora do hero; hero com `fetchpriority="high"`.
- [ ] Iframe do Google Maps com `loading="lazy"`.
- [ ] Fontes: só subsets necessários baixados na primeira carga; `font-display: swap`.
- [ ] `vercel-react-best-practices`: sem re-render desnecessário, sem import de pacote inteiro (lucide mapeado estaticamente).
- [ ] `gsap-performance`: só `transform`/`opacity`, parallax off < 768 px, ScrollTriggers limpos no unmount.

### 3.2 Acessibilidade
- [ ] Skip link visível no foco e leva a `#conteudo`.
- [ ] Landmarks: `header`, `nav`, `main`, `footer`; um único `h1`; hierarquia de headings sem saltos.
- [ ] Tab order lógico; foco visível em todos os interativos; sem foco preso.
- [ ] Sheet (menu mobile): abre com Enter/Espaço, foco vai para dentro, `Esc` fecha, foco volta ao gatilho.
- [ ] Accordion do FAQ operável por teclado, `aria-expanded` correto.
- [ ] Leitor de tela (Orca/NVDA/VoiceOver): CTAs com nome claro; links externos indicam nova aba; ícones decorativos com `aria-hidden`.
- [ ] Contraste AA (texto 4.5:1, UI 3:1), incluindo FAB WhatsApp (`text-whatsapp-ink`).
- [ ] Alvos de toque ≥ 44×44 px no mobile.
- [ ] `alt` descritivo nas imagens; logo com `alt` do nome.
- [ ] Reduced motion: nenhuma animação GSAP/Motion relevante; conteúdo visível sem JS de animação.

### 3.3 Responsivo
- [ ] 360 · [ ] 390 · [ ] 768 · [ ] 1024 · [ ] 1440: sem overflow horizontal, sem texto cortado, FAB não cobre CTA/rodapé.

### 3.4 Conteúdo e conformidade (CFO)
- [ ] Nome e CRO da responsável técnica visíveis (equipe + rodapé).
- [ ] Sem promessa de resultado, preço, promoção, "melhor/único".
- [ ] Sem antes/depois.
- [ ] `TODO(conteudo)` não aparece na UI (`grep -rn "TODO" dist`).
- [ ] Listas vazias (`horarios`, `galeria`, `numeros`) omitem o bloco sem placeholder visível.
- [ ] © ano dinâmico no rodapé.

### 3.5 SEO e compartilhamento
- [ ] Rich Results Test / Schema Validator no JSON-LD: sem erros.
- [ ] Preview de compartilhamento (WhatsApp, Facebook Sharing Debugger, X) com og-image correta.
- [ ] `robots.txt` e `sitemap.xml` servidos com o domínio final.
- [ ] Canonical aponta para o domínio final.

### 3.6 Analytics
- [ ] Sem `VITE_GTM_ID`: nenhum request para googletagmanager.com.
- [ ] Com `VITE_GTM_ID`: `gtm.js` carrega; GTM Preview recebe `whatsapp_click` com `origem` em todos os CTAs.
- [ ] Trigger "Custom Event = whatsapp_click" configurado no container (tarefa no GTM, fora do código).

### 3.7 Higiene
- [ ] Console sem erros/warnings no build de produção (todas as larguras).
- [ ] Sem links quebrados (internos e externos: Instagram, Maps, wa.me, tel:).
- [ ] `pnpm typecheck && pnpm lint && pnpm build` passando.
- [ ] Headers de cache/segurança conferidos na preview (`curl -I`).

## 4. Achados
| # | Achado | Severidade | Arquivo | Dono | Status |
|---|---|---|---|---|---|
| — | _Fase 3_ | | | | |

## 5. Deploy
- Preview Vercel: _URL na Fase 3_.
- Produção: **somente com aprovação explícita do Davi**.
