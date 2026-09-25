import { useEffect, useState } from 'react'

/**
 * O horário atual, atualizado a cada intervalo enquanto active for true.
 * Quem conta o tempo é o relógio do sistema (Date.now), e não a soma de
 * intervalos: uma aba em segundo plano atrasa o setInterval, mas não o relógio.
 */
export function useNow(intervalMs: number, active = true): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return

    const tick = () => setNow(Date.now())
    // A primeira leitura sai logo, sem esperar o intervalo inteiro: ao dar play,
    // o relógio já mostra o tempo certo
    const first = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, intervalMs)

    return () => {
      window.clearTimeout(first)
      window.clearInterval(interval)
    }
  }, [intervalMs, active])

  return now
}
