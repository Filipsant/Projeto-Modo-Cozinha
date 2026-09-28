import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Recipe } from '@/entities/recipe'
import { isShoppable } from '../lib/aisleOf'

export interface ShoppingRecipe {
  id: string
  name: string
  thumbnail: string
  /** As porções escolhidas no detalhe: as medidas da lista são calculadas por elas. */
  servings: number
}

export interface ShoppingItem {
  /** "receita:posição": o mesmo ingrediente em duas receitas são dois itens. */
  id: string
  recipeId: string
  /** Nome e medida como vieram da API; a tela traduz e converte na hora de mostrar. */
  name: string
  measure: string
  bought: boolean
}

interface ShoppingListState {
  recipes: ShoppingRecipe[]
  items: ShoppingItem[]
  /**
   * Adiciona a receita, ou só atualiza as porções se ela já estiver na lista.
   * Com positions, põe na lista só esses ingredientes (as posições na receita):
   * é a escolha feita no diálogo, e vale também para quem já estava na lista.
   */
  addRecipe: (recipe: Recipe, servings: number, positions?: readonly number[]) => void
  removeRecipe: (recipeId: string) => void
  toggleItem: (itemId: string) => void
  clearBought: () => void
  clear: () => void
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      recipes: [],
      items: [],

      addRecipe(recipe, servings, positions) {
        const inList = get().recipes.some((item) => item.id === recipe.id)

        if (inList && !positions) {
          // Já está na lista: muda as porções e preserva o que já foi comprado
          set((state) => ({
            recipes: state.recipes.map((item) =>
              item.id === recipe.id ? { ...item, servings } : item,
            ),
          }))

          return
        }

        // Nenhum ingrediente escolhido: a receita sai da lista
        if (positions?.length === 0) {
          get().removeRecipe(recipe.id)
          return
        }

        const chosen = positions ? new Set(positions) : null
        const previous = new Map(get().items.map((item) => [item.id, item]))
        const items = recipe.ingredients
          .map((ingredient, position) => ({ ingredient, position }))
          .filter(
            ({ ingredient, position }) =>
              isShoppable(ingredient.name) && (!chosen || chosen.has(position)),
          )
          .map(({ ingredient, position }) => {
            const id = `${recipe.id}:${position}`

            return {
              id,
              recipeId: recipe.id,
              name: ingredient.name,
              measure: ingredient.measure,
              // Mudar a escolha não desmarca o que já foi para o carrinho
              bought: previous.get(id)?.bought ?? false,
            }
          })

        set((state) => ({
          recipes: inList
            ? state.recipes.map((item) => (item.id === recipe.id ? { ...item, servings } : item))
            : [
                ...state.recipes,
                { id: recipe.id, name: recipe.name, thumbnail: recipe.thumbnail, servings },
              ],
          // Os itens da receita trocam de lugar juntos, e as outras receitas ficam como estão
          items: [...state.items.filter((item) => item.recipeId !== recipe.id), ...items],
        }))
      },

      removeRecipe(recipeId) {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== recipeId),
          items: state.items.filter((item) => item.recipeId !== recipeId),
        }))
      },

      toggleItem(itemId) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, bought: !item.bought } : item,
          ),
        }))
      },

      clearBought() {
        set((state) => {
          const items = state.items.filter((item) => !item.bought)
          // Receita sem nenhum item sobrando sai da lista junto
          const recipes = state.recipes.filter((recipe) =>
            items.some((item) => item.recipeId === recipe.id),
          )

          return { items, recipes }
        })
      },

      clear() {
        set({ recipes: [], items: [] })
      },
    }),
    { name: 'modo-cozinha:shopping-list', version: 1 },
  ),
)

/** Quantos itens faltam comprar: é o número no cabeçalho. */
export function usePendingCount(): number {
  return useShoppingListStore((state) => state.items.filter((item) => !item.bought).length)
}

/** As porções com que a receita está na lista, ou null se ela não está. */
export function useServingsInList(recipeId: string): number | null {
  return useShoppingListStore(
    (state) => state.recipes.find((recipe) => recipe.id === recipeId)?.servings ?? null,
  )
}

/** As posições, na receita, dos ingredientes que estão na lista agora. */
export function useItemPositionsInList(recipeId: string): number[] {
  const items = useShoppingListStore((state) => state.items)

  return useMemo(
    () =>
      items
        .filter((item) => item.recipeId === recipeId)
        .map((item) => Number(item.id.slice(item.id.lastIndexOf(':') + 1))),
    [items, recipeId],
  )
}

/** Quantos itens a receita põe na lista: tudo menos água e gelo. */
export function shoppableCount(recipe: Pick<Recipe, 'ingredients'>): number {
  return recipe.ingredients.filter((ingredient) => isShoppable(ingredient.name)).length
}
