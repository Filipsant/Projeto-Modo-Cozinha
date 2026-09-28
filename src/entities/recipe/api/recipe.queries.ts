import { queryOptions } from '@tanstack/react-query'
import { translateLines } from '@/shared/api'
import type { Recipe } from '../model/recipe.types'
import { mealdbClient } from './mealdbClient'

const MINUTE = 60_000

// staleTime conforme a tabela do roadmap: receita quase não muda, então vale
// reaproveitar o cache ao voltar de uma receita para a busca.
export const recipeQueries = {
  all: ['recipes'] as const,

  search: (term: string) =>
    queryOptions({
      queryKey: [...recipeQueries.all, 'search', term] as const,
      queryFn: ({ signal }) => mealdbClient.search(term, { signal }),
      // Sem termo a API devolve uma seleção de 25 receitas, que é a home do design
      staleTime: 5 * MINUTE,
    }),

  // O catálogo não muda durante a sessão: busca uma vez e serve todas as buscas
  catalog: () =>
    queryOptions({
      queryKey: [...recipeQueries.all, 'catalog'] as const,
      queryFn: ({ signal }) => mealdbClient.listCatalog({ signal }),
      staleTime: Infinity,
      gcTime: Infinity,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: [...recipeQueries.all, 'detail', id] as const,
      queryFn: ({ signal }) => mealdbClient.getById(id, { signal }),
      staleTime: 30 * MINUTE,
    }),

  // A tradução de um texto não muda: vale a sessão inteira. Uma tentativa extra
  // só, para quem está sem internet ver logo o texto original
  translatedSteps: (recipe: Pick<Recipe, 'id' | 'steps'>, language: string) =>
    queryOptions({
      queryKey: [...recipeQueries.all, 'steps', recipe.id, language] as const,
      queryFn: ({ signal }) => translateLines(recipe.steps, { from: 'en', to: language, signal }),
      staleTime: Infinity,
      retry: 1,
    }),
}
