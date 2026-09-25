import type { Ingredient } from '../model/recipe.types'

/**
 * Tira os repetidos, ficando com a primeira ocorrência. Há receitas que listam o
 * mesmo ingrediente duas vezes ("Sugar" na massa e "Sugar" na cobertura): na
 * lista completa as duas medidas importam, mas num chip basta um "Açúcar".
 */
export function uniqueIngredients(ingredients: Ingredient[]): Ingredient[] {
  const seen = new Set<string>()

  return ingredients.filter((ingredient) => {
    const key = ingredientKey(ingredient)

    if (seen.has(key)) return false

    seen.add(key)

    return true
  })
}

/** Chave estável para listas do React: "Sugar" e "sugar " são o mesmo ingrediente. */
export function ingredientKey(ingredient: Ingredient): string {
  return ingredient.name.trim().toLowerCase()
}
