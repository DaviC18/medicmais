#!/usr/bin/env bash
# Instala as skills do projeto em .claude/skills (rodar na raiz do projeto)
set -euo pipefail

A="--agent claude-code -y"

echo "→ GSAP (oficial, 8 skills)"
npx -y skills add greensock/gsap-skills $A

echo "→ Impeccable"
npx -y skills add pbakaus/impeccable $A

echo "→ Taste Skill (design-taste-frontend)"
npx -y skills add Leonxlnx/taste-skill --skill design-taste-frontend $A
# Para todas as variantes (minimalist, high-end, redesign...): npx -y skills add Leonxlnx/taste-skill $A

echo "→ shadcn/ui (oficial)"
npx -y skills add shadcn/ui $A

echo "→ Vercel: web-design-guidelines + react-best-practices"
npx -y skills add vercel-labs/agent-skills --skill web-design-guidelines $A
npx -y skills add vercel-labs/agent-skills --skill vercel-react-best-practices $A

echo "✓ Skills instaladas. Alternativa via plugins no Claude Code:"
echo "  /plugin marketplace add greensock/gsap-skills"
echo "  /plugin marketplace add pbakaus/impeccable"
echo "  /plugin marketplace add Leonxlnx/taste-skill"
