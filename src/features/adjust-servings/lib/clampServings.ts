import { BASE_SERVINGS, MAX_SERVINGS, MIN_SERVINGS } from '@/shared/config'

/**
 * O valor vem da URL, então pode ser qualquer coisa: "abc", "0", "2.5", "999".
 * Sem número inteiro válido volta para a base; fora dos limites encosta neles.
 */
export function clampServings(value: unknown): number {
  const servings = typeof value === 'string' ? Number(value) : value

  if (typeof servings !== 'number' || !Number.isInteger(servings) || servings <= 0) {
    return BASE_SERVINGS
  }

  return Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, servings))
}
