import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { recipeQueries } from '@/entities/recipe'
import { filterRecipes } from '../lib/filterRecipes'
import { useBrowseParams } from './useBrowseParams'

// Duas fontes, por causa do limite da API:
//  - sem filtro: search.php?s= devolve 25 receitas na hora, e a home já pinta
//  - com filtro: o catálogo completo (790 receitas), filtrado aqui no cliente
export function useRecipeResults() {
  const queryClient = useQueryClient()
  const { term, category, area, hasFilters } = useBrowseParams()

  const selection = useQuery({ ...recipeQueries.search(''), enabled: !hasFilters })
  const catalog = useQuery({ ...recipeQueries.catalog(), enabled: hasFilters })

  // Aquece o catálogo em segundo plano assim que a home aparece, para a
  // primeira busca não esperar os ~12 segundos do download
  useEffect(() => {
    void queryClient.prefetchQuery(recipeQueries.catalog())
  }, [queryClient])

  if (!hasFilters) {
    return {
      recipes: selection.data,
      isPending: selection.isPending,
      isError: selection.isError,
      refetch: selection.refetch,
    }
  }

  return {
    recipes: catalog.data ? filterRecipes(catalog.data, { term, category, area }) : undefined,
    isPending: catalog.isPending,
    isError: catalog.isError,
    refetch: catalog.refetch,
  }
}
