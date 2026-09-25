import { normalizeText } from '@/shared/lib'
import type { FavoriteRecipe } from '../model/favoritesStore'

/** Os três chips do design: mais recentes, A–Z e rápidas. */
export type FavoritesView = 'recent' | 'alphabetical' | 'quick'

export const FAVORITES_VIEWS: FavoritesView[] = ['recent', 'alphabetical', 'quick']

/** "Rápidas (<30 min)": até 30 minutos pela nossa estimativa. */
export const QUICK_MINUTES = 30

export interface FavoritesQuery {
  term: string
  view: FavoritesView
  /** O botão de inverter: mais antigas, Z–A ou as rápidas mais demoradas primeiro. */
  reversed: boolean
}

const byName = (a: FavoriteRecipe, b: FavoriteRecipe) => a.name.localeCompare(b.name)

const ORDER: Record<FavoritesView, (a: FavoriteRecipe, b: FavoriteRecipe) => number> = {
  recent: (a, b) => b.savedAt - a.savedAt,
  alphabetical: byName,
  quick: (a, b) => a.estimatedMinutes - b.estimatedMinutes || byName(a, b),
}

export function selectFavorites(items: FavoriteRecipe[], query: FavoritesQuery): FavoriteRecipe[] {
  const term = normalizeText(query.term.trim())

  const selected = items.filter((item) => {
    // Parcial ainda não tem tempo: não dá para dizer que é rápida
    if (query.view === 'quick' && (item.partial || item.estimatedMinutes > QUICK_MINUTES)) {
      return false
    }

    if (!term) return true

    return (
      normalizeText(item.name).includes(term) ||
      item.ingredients.some((ingredient) => normalizeText(ingredient.name).includes(term))
    )
  })

  const sorted = selected.sort(ORDER[query.view])

  return query.reversed ? sorted.reverse() : sorted
}
