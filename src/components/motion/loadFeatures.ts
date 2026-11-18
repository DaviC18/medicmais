/** Import cru do chunk de features do Motion (rejeita se a rede falhar). */
export const importMotionFeatures = () => import('./features').then((mod) => mod.default)

/**
 * Carrega as features do Motion (animações + hover/tap/focus) num chunk separado.
 * O módulo é cacheado pelo bundler: chamar várias vezes faz uma requisição só.
 *
 * Se o chunk falhar, a promise nunca resolve (em vez de rejeitar sem tratamento):
 * os componentes `m.*` ficam como elementos estáticos, sem erro no console.
 *
 * Uso: `<LazyMotion features={loadMotionFeatures}>` (feito pelos componentes de
 * `src/components/motion/`; as seções não precisam saber disso).
 */
export const loadMotionFeatures = () =>
  importMotionFeatures().catch(() => new Promise<never>(() => {}))
