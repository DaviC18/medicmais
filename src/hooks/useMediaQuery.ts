import { useCallback, useSyncExternalStore } from 'react'

/**
 * Assina uma media query e devolve se ela casa agora. Seguro para SSR
 * (devolve `false` no servidor) e sem setState em effect.
 *
 * @example
 * const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
