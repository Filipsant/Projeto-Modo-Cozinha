import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { recipeQueries } from '@/entities/recipe'

/** Quantas origens aparecem como chip; o resto vai para o seletor. */
export const VISIBLE_AREAS = 8

interface Facet {
  value: string
  count: number
}

function contar(values: (string | undefined)[]): Facet[] {
  const counts = new Map<string, number>()

  for (const value of values) {
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

// As opções de filtro saem do próprio catálogo: mostrar uma origem que não tem
// receita nenhuma é o erro que a lista fixa causava.
export function useCatalogFacets() {
  const { data } = useQuery(recipeQueries.catalog())

  return useMemo(
    () => ({
      categories: contar((data ?? []).map((recipe) => recipe.category)),
      areas: contar((data ?? []).map((recipe) => recipe.area)),
      isReady: Boolean(data),
    }),
    [data],
  )
}
