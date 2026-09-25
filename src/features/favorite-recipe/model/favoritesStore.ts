import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe, RecipeSummary } from '@/entities/recipe'

export interface FavoriteRecipe extends Recipe {
  /** Quando foi salva: a página de favoritos ordena por isto. */
  savedAt: number
  /**
   * Salva na versão 1, que guardava só nome, foto, categoria e origem. Falta
   * buscar o resto na API; enquanto isso, tempo e dificuldade não aparecem.
   */
  partial?: boolean
}

interface RemovedFavorite {
  item: FavoriteRecipe
  /** Onde ela estava, para o "Desfazer" devolver ao mesmo lugar. */
  index: number
}

interface FavoritesState {
  items: FavoriteRecipe[]
  /** A última removida, para o aviso com "Desfazer". Não vai para o localStorage. */
  lastRemoved: RemovedFavorite | null
  toggle: (recipe: Recipe) => void
  remove: (id: string) => void
  undoRemove: () => void
  dismissUndo: () => void
  /** Troca a cópia salva pela receita completa, mantendo a data em que foi salva. */
  refresh: (recipe: Recipe) => void
  clear: () => void
}

// A versão 1 não tinha estes campos: a receita entra vazia e marcada como parcial
const MISSING_DETAILS: Omit<Recipe, keyof RecipeSummary> = {
  instructions: '',
  steps: [],
  ingredients: [],
  tags: [],
  estimatedMinutes: 0,
  difficulty: 'easy',
  methods: [],
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      lastRemoved: null,

      toggle(recipe) {
        if (get().items.some((item) => item.id === recipe.id)) {
          get().remove(recipe.id)

          return
        }

        set((state) => ({
          items: [{ ...recipe, savedAt: Date.now() }, ...state.items],
          // Salvou de novo a que tinha acabado de tirar: o "Desfazer" perdeu o sentido
          lastRemoved: state.lastRemoved?.item.id === recipe.id ? null : state.lastRemoved,
        }))
      },

      remove(id) {
        const index = get().items.findIndex((item) => item.id === id)

        if (index === -1) return

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          lastRemoved: { item: state.items[index], index },
        }))
      },

      undoRemove() {
        const { lastRemoved, items } = get()

        if (!lastRemoved) return

        if (items.some((item) => item.id === lastRemoved.item.id)) {
          set({ lastRemoved: null })

          return
        }

        const next = [...items]
        next.splice(Math.min(lastRemoved.index, next.length), 0, lastRemoved.item)
        set({ items: next, lastRemoved: null })
      },

      dismissUndo() {
        set({ lastRemoved: null })
      },

      refresh(recipe) {
        // Só escreve quando muda algo: sem isso, cada chamada renderizaria a página de novo
        if (!get().items.some((item) => item.id === recipe.id && item.partial)) return

        set((state) => ({
          items: state.items.map((item) =>
            item.id === recipe.id ? { ...recipe, savedAt: item.savedAt } : item,
          ),
        }))
      },

      clear() {
        set({ items: [], lastRemoved: null })
      },
    }),
    {
      // Prefixo e versão em todo store persistido: permitem migrar o formato depois
      name: 'modo-cozinha:favorites',
      version: 2,
      partialize: (state) => ({ items: state.items }),
      migrate: (persisted, version) => {
        const state = persisted as { items?: (RecipeSummary & { savedAt: number })[] }

        if (version < 2) {
          return {
            items: (state.items ?? []).map((item) => ({
              ...MISSING_DETAILS,
              ...item,
              partial: true,
            })),
          }
        }

        return state
      },
    },
  ),
)

/** Hook estreito de propósito: o componente só renderiza de novo se ESTA receita mudar. */
export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => state.items.some((item) => item.id === id))
}
