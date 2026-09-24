import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RecipeSummary } from '@/entities/recipe'

export interface FavoriteRecipe extends RecipeSummary {
  /** Quando foi salva: a página de favoritos ordena por isto. */
  savedAt: number
}

interface FavoritesState {
  items: FavoriteRecipe[]
  toggle: (recipe: RecipeSummary) => void
  remove: (id: string) => void
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle(recipe) {
        const jaSalva = get().items.some((item) => item.id === recipe.id)

        set((state) => ({
          items: jaSalva
            ? state.items.filter((item) => item.id !== recipe.id)
            : [{ ...recipe, savedAt: Date.now() }, ...state.items],
        }))
      },

      remove(id) {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
      },

      clear() {
        set({ items: [] })
      },
    }),
    {
      // Prefixo e versão em todo store persistido: permitem migrar o formato depois
      name: 'modo-cozinha:favorites',
      version: 1,
    },
  ),
)

/** Hook estreito de propósito: o componente só renderiza de novo se ESTA receita mudar. */
export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => state.items.some((item) => item.id === id))
}
