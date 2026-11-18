/**
 * Pacote de features do Motion carregado sob demanda (DECISIONS D22).
 *
 * Importado só via `import()` em `loadMotionFeatures` (MotionProvider), para que
 * o motor de animação/gestos (`domAnimation`, ~15 KB gzip) saia do JS inicial.
 * Não importe este arquivo estaticamente.
 */
export { domAnimation as default } from 'motion/react'
