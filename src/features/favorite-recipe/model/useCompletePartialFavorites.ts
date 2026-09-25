import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { recipeQueries } from '@/entities/recipe'
import { useFavoritesStore } from './favoritesStore'

// Favoritas salvas na versão 1 só têm nome e foto. Busca o resto uma vez; se a
// receita saiu da API, ela continua parcial e o cartão só não mostra o tempo.
export function useCompletePartialFavorites() {
  const queryClient = useQueryClient()
  const refresh = useFavoritesStore((state) => state.refresh)
  // Texto e não array: o efeito só roda de novo quando a lista de ids muda de fato
  const partialIds = useFavoritesStore((state) =>
    state.items
      .filter((item) => item.partial)
      .map((item) => item.id)
      .join(','),
  )

  useEffect(() => {
    if (!partialIds) return

    for (const id of partialIds.split(',')) {
      queryClient
        .ensureQueryData(recipeQueries.detail(id))
        .then((recipe) => {
          if (recipe) refresh(recipe)
        })
        .catch(() => {
          // Sem rede agora: tenta de novo na próxima visita
        })
    }
  }, [partialIds, queryClient, refresh])
}
