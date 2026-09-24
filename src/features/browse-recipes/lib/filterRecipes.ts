import type { Recipe } from '@/entities/recipe'

export interface RecipeFilters {
  term: string
  category: string
  area: string
}

// "açúcar" acha "acucar", e "CHICKEN" acha "chicken"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
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
