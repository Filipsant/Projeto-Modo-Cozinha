import { queryOptions } from '@tanstack/react-query'
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
}
