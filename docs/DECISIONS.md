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
