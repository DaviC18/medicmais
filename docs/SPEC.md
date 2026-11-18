# SPEC.md — Spec funcional e técnica

## 1. Objetivo
Single page que transmite **acolhimento + confiança técnica** e converte visitas em conversas no WhatsApp.
- KPI principal: cliques em CTA de WhatsApp.
- Público: famílias e adultos de Barra Mansa e região (Ano Bom), muito tráfego mobile vindo do Instagram e Google Maps.

## 2. Direção visual
- Sensação: clínica limpa, humana, calorosa — **não** "template de dentista azul genérico".
- Base clara (off-white quente), acentos no vermelho do coração da marca usados com parcimônia (CTAs e detalhes), azul-marinho para texto/títulos.
- Tipografia: display serifada ou grotesca com personalidade para títulos (ex.: "Fraunces" ou "Instrument Serif") + sans legível para corpo (ex.: "Inter Tight" / "Geist"). Decisão final do Agente 1 seguindo `impeccable`.
- Fotos reais > ilustrações. Cantos arredondados generosos, sombras suaves.
- Movimento: calmo e elegante (ease `power3.out`/`expo.out`, durações 0.6–1.2s). Nada que pareça "agência de games".

### Tokens provisórios (`src/index.css` → `@theme`)
| Token | Valor provisório | Uso |
|---|---|---|
| `--color-brand` | `#D7263D` | CTAs, coração, destaques |
| `--color-brand-ink` | `#14213D` | títulos, texto forte |
| `--color-surface` | `#FBF8F4` | fundo base |
| `--color-surface-2` | `#F2ECE4` | seções alternadas |
| `--color-muted` | `#5B6475` | texto secundário |
| `--color-whatsapp` | `#25D366` | botão flutuante |
| `--radius-xl` | `1.5rem` | cards |
Ajustar quando o logo oficial chegar. Contraste mínimo AA (4.5:1 texto, 3:1 UI).

## 3. Seções (ordem e requisitos)
| # | id | Seção | Conteúdo | Componentes | Motion |
|---|---|---|---|---|---|
| 0 | — | Header fixo | logo, âncoras, CTA WhatsApp | shadcn `Button`, `Sheet` (mobile) | esconde ao rolar p/ baixo, volta ao subir |
| 1 | `inicio` | Hero | headline, subtítulo, 2 CTAs (WhatsApp / Ver serviços), foto, selo CRO | React Bits texto (ex.: SplitText/BlurText) | timeline de entrada; parallax leve na foto |
| 2 | `sobre` | Atendimento humanizado | texto institucional + 3–4 diferenciais | Card | reveal em stagger |
| 3 | `servicos` | Serviços | 4 cards (dados) + CTA "Agendar avaliação" | Card, ícones lucide | stagger + hover (Motion) |
| 4 | `equipe` | Responsável técnica | foto, nome, CRO, frase | Card/Avatar | reveal |
| 5 | `clinica` | A clínica | galeria 4–6 fotos | grid/masonry | ScrollTrigger reveal/scale |
| 6 | `depoimentos` | Depoimentos | 3+ avaliações 5★ | Card / carrossel ou marquee React Bits | marquee ou fade |
| 7 | `numeros` (opcional) | Números | ex.: anos, pacientes (só se houver dado real) | React Bits CountUp | conta ao entrar |
| 8 | `faq` | FAQ | 5–6 perguntas (aceita convênio? primeira consulta? implante dói? etc.) | shadcn `Accordion` | — |
| 9 | `contato` | CTA final + mapa | headline, WhatsApp, telefone, endereço, horários, iframe Google Maps (lazy) | Button, Card | reveal |
| 10 | — | Rodapé | CNPJ, responsável técnica + CRO, Instagram, © ano dinâmico | — | — |
| — | — | Botão flutuante WhatsApp | fixo canto inferior direito | — | entra após 30% de scroll (Motion) |

## 4. Requisitos técnicos
- Estrutura:
```
src/
  main.tsx, App.tsx, index.css
  data/clinica.ts            # conteúdo tipado (tipos em types.ts)
  data/types.ts
  lib/utils.ts (cn), lib/whatsapp.ts, lib/gsap.ts (registro de plugins + presets)
  hooks/useReveal.ts         # hook GSAP padrão (Agente 3)
  components/ui/*            # shadcn
  components/reactbits/*     # React Bits
  components/layout/Header.tsx, Footer.tsx, WhatsAppFab.tsx, Section.tsx, Container.tsx
  sections/Hero.tsx, About.tsx, Services.tsx, Team.tsx, Clinic.tsx, Testimonials.tsx, Stats.tsx, FAQ.tsx, Contact.tsx
public/ images/, favicon.svg, og-image.jpg, robots.txt, sitemap.xml
```
- Alias `@/` → `src/`.
- Lenis (opcional) para smooth scroll integrado ao ScrollTrigger — só se não piorar INP.
- SEO: `<title>`, meta description, OG/Twitter, canonical, `lang="pt-BR"`, JSON-LD `Dentist` (nome, endereço, telefone, geo, horários, sameAs Instagram).
- Analytics: manter GTM existente (`GTM-5CJDZL8K`) e disparar evento `whatsapp_click` (dataLayer) em todo CTA.
- Acessibilidade: landmarks, skip link, foco visível, alt descritivo, menu mobile navegável por teclado, `prefers-reduced-motion`.
- Performance (mobile, Lighthouse): Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO = 100. LCP < 2.5s, CLS < 0.1. JS inicial < 200KB gzip.
- Deploy: Vercel (static). 

## 5. Critérios de aceite
- [ ] Todas as seções da tabela renderizam com dados de `clinica.ts`.
- [ ] Todo CTA abre WhatsApp com mensagem pré-preenchida e dispara `whatsapp_click`.
- [ ] Nenhum link `https://#` ou botão morto.
- [ ] Responsável técnica + CRO visível no rodapé e na seção equipe.
- [ ] Menu mobile funciona; âncoras rolam com offset do header.
- [ ] Animações desligam com reduced motion; sem layout shift causado por animação.
- [ ] Metas de Lighthouse atingidas no build de produção.
- [ ] Auditorias `impeccable` e `web-design-guidelines` sem itens críticos.
