# KICKOFF.md — Prompts para disparar os agentes no Claude Code

Pré-requisito: kit copiado para a raiz do projeto e `bash scripts/install-skills.sh` executado.
Crie `docs/HANDOFF.md` e `docs/DECISIONS.md` vazios (ou deixe o Agente 1 criar).

## Fase 0
```
Use o subagente 01-foundation para executar a Fase 0 do docs/PLAN.md até o gate G0.
```
Confira: `pnpm dev` abre os stubs; tokens e `clinica.ts` ok.

## Fase 1 (paralelo)
```
Em paralelo, use os subagentes:
- 02-sections: construir Header, Footer, WhatsAppFab e todas as seções (Fase 1 do PLAN).
- 03-motion: criar lib/gsap.ts, hooks e componentes Motion (Fase 1 do PLAN).
- 04-qa-launch: infra de SEO, GTM, robots/sitemap e vercel.json (Fase 1 do PLAN).
Respeitem docs/CONTRACTS.md e registrem pedidos em docs/HANDOFF.md.
```
Dica: para evitar conflito, rode cada um em worktree (`isolation: worktree`) ou garanta que só mexem nos próprios arquivos.

## Fase 2
```
Use 03-motion para aplicar as animações nas seções resolvendo os pedidos do HANDOFF,
e depois 02-sections para atender o HANDOFF e rodar /impeccable + design-taste-frontend em cada seção.
```

## Fase 3
```
Use 04-qa-launch para a auditoria completa da Fase 3, gerar docs/QA-REPORT.md e abrir pedidos no HANDOFF.
Depois rode 02-sections e 03-motion para resolver os pedidos, e 04-qa-launch para retestar e fazer deploy de preview.
```

## Atualizar conteúdo depois
```
Atualize docs/CONTENT.md com: <cole aqui horários / especialidades / equipe>.
Use 01-foundation só para refletir isso em src/data/clinica.ts.
```
