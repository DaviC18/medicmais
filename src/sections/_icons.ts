// Mapa estático nome → ícone lucide para os nomes usados em clinica.ts (sem import dinâmico).
import {
  BadgeCheck,
  BadgePlus,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Sofa,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  BadgePlus,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Sofa,
  Stethoscope,
}

/** Ícone pelo nome do clinica.ts; nome desconhecido cai em `Sparkles`. */
export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles
}
