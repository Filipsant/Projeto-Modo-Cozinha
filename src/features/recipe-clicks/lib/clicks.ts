/** A janela do ranking "Em alta": só contam as aberturas dos últimos 7 dias. */
export const CLICK_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

/** Aberturas da mesma receita mais perto que isto são um clique só (recarregar, StrictMode). */
export const DUPLICATE_MS = 2000

/** Quando cada receita foi aberta, em ms. */
export type RecipeOpens = Record<string, number[]>

/** Soma uma abertura, a menos que a anterior da mesma receita tenha acabado de acontecer. */
export function addOpen(opens: RecipeOpens, recipeId: string, now: number): RecipeOpens {
  const previous = opens[recipeId] ?? []
  const last = previous.at(-1)

  if (last !== undefined && now - last < DUPLICATE_MS) return opens

  return pruneOpens({ ...opens, [recipeId]: [...previous, now] }, now)
}

/** Tira as aberturas de fora da janela, e as receitas que ficaram sem nenhuma. */
export function pruneOpens(opens: RecipeOpens, now: number): RecipeOpens {
  const pruned: RecipeOpens = {}

  for (const [recipeId, times] of Object.entries(opens)) {
    const recent = times.filter((time) => now - time < CLICK_WINDOW_MS)

    if (recent.length > 0) pruned[recipeId] = recent
  }

  return pruned
}

/** Cliques por receita. */
export function countClicks(opens: RecipeOpens): Record<string, number> {
  return Object.fromEntries(
    Object.entries(opens).map(([recipeId, times]) => [recipeId, times.length]),
  )
}
