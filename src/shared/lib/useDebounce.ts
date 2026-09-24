import { useEffect, useState } from 'react'

// Espera o usuário parar de digitar antes de deixar o valor passar (RF01).
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)

    // Cada tecla cancela o temporizador anterior: só o último valor sobrevive
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
