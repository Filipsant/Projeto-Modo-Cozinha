import type { Recipe } from '@/entities/recipe'
import { normalizeText as normalize } from '@/shared/lib'

export interface RecipeFilters {
  term: string
  category: string
  area: string
}

// Filtra o catálogo no cliente. É o que permite passar do limite de 25
// resultados da API e combinar busca, categoria e origem ao mesmo tempo.
export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  const term = normalize(filters.term.trim())

  return recipes.filter((recipe) => {
    if (filters.category && recipe.category !== filters.category) return false
    if (filters.area && recipe.area !== filters.area) return false
    if (!term) return true

    const matchesName = normalize(recipe.name).includes(term)
    const matchesIngredient = recipe.ingredients.some((ingredient) =>
      normalize(ingredient.name).includes(term),
    )

    return matchesName || matchesIngredient
  })
}
