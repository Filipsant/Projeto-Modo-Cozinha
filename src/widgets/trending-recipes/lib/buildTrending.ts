import type { Recipe } from '@/entities/recipe'

export interface TrendingItem {
  recipe: Recipe
  clicks: number
  /** Posição no ranking, a partir de 1; null nas sugestões, que ainda não têm clique. */
  rank: number | null
}

/** Quantos cartões o trilho mostra. */
export const TRENDING_LIMIT = 10

/**
 * O ranking primeiro, da mais clicada para a menos; se sobrar lugar, sugestões
 * do catálogo. As sugestões seguem uma ordem embaralhada, mas sempre a mesma:
 * o trilho não muda de lugar a cada visita.
 */
export function buildTrending(
  recipes: Recipe[],
  clicks: Record<string, number>,
  limit = TRENDING_LIMIT,
): TrendingItem[] {
  const ranked = recipes
    .filter((recipe) => (clicks[recipe.id] ?? 0) > 0)
    .sort((a, b) => clicks[b.id] - clicks[a.id] || a.name.localeCompare(b.name))
    .slice(0, limit)
  const rankedIds = new Set(ranked.map((recipe) => recipe.id))
  const suggestions = recipes
    .filter((recipe) => !rankedIds.has(recipe.id))
    .sort((a, b) => shuffleKey(a.id) - shuffleKey(b.id))
    .slice(0, limit - ranked.length)

  return [
    ...ranked.map((recipe, index) => ({ recipe, clicks: clicks[recipe.id], rank: index + 1 })),
    ...suggestions.map((recipe) => ({ recipe, clicks: 0, rank: null })),
  ]
}

// Hash simples (FNV-1a) do id: espalha as receitas sem depender da ordem da API,
// que vem por letra e encheria o trilho de receitas com A
function shuffleKey(id: string): number {
  let hash = 2166136261

  for (const char of id) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}
