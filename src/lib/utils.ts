import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge ciente dos tokens próprios de src/index.css (@theme).
 * Sem isso, `text-lead` etc. seriam tratados como cor e `py-section`/`max-w-page`
 * não conflitariam com `py-4`/`max-w-md`. Cores custom já funcionam no padrão.
 * Ao criar um token novo de tamanho/espaço/largura no @theme, acrescente-o aqui.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title", "subtitle", "lead", "body", "small", "eyebrow"],
      spacing: ["section", "gutter", "header"],
      container: ["page", "reading"],
      shadow: ["soft", "card", "lift"],
      ease: ["out-soft"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
