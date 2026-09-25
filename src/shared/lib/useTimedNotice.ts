import { useEffect, useState } from 'react'

/**
 * Um aviso que some sozinho depois de alguns segundos, como "Link copiado".
 * Mostrar outro aviso antes do tempo reinicia a contagem.
 */
export function useTimedNotice(
  durationMs = 4000,
): [string | null, (message: string) => void, () => void] {
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return

    const timer = window.setTimeout(() => setNotice(null), durationMs)

    return () => window.clearTimeout(timer)
  }, [notice, durationMs])

  return [notice, setNotice, () => setNotice(null)]
}
