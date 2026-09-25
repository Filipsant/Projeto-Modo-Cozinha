import { useEffect, useState } from 'react'

/**
 * Mantém a tela acesa enquanto o componente estiver na tela, para ninguém
 * precisar tocar no celular com a mão suja de farinha. Devolve se conseguiu.
 *
 * O navegador solta o bloqueio quando a aba fica em segundo plano; por isso
 * pedimos de novo quando ela volta a ficar visível. Navegador sem suporte
 * simplesmente devolve false.
 */
export function useWakeLock(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let disposed = false

    async function request() {
      try {
        const next = await navigator.wakeLock.request('screen')

        if (disposed) {
          await next.release()

          return
        }

        sentinel = next
        setActive(true)
        next.addEventListener('release', () => setActive(false))
      } catch {
        // Bateria fraca ou permissão negada: segue sem bloqueio
        setActive(false)
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      void sentinel?.release()
    }
  }, [])

  return active
}
