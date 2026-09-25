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
  /** Adiciona a receita, ou só atualiza as porções se ela já estiver na lista. */
  addRecipe: (recipe: Recipe, servings: number) => void
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

      addRecipe(recipe, servings) {
        if (get().recipes.some((item) => item.id === recipe.id)) {
          // Já está na lista: muda as porções e preserva o que já foi comprado
          set((state) => ({
            recipes: state.recipes.map((item) =>
              item.id === recipe.id ? { ...item, servings } : item,
            ),
          }))

          return
        }

        const items = recipe.ingredients
          .map((ingredient, position) => ({ ingredient, position }))
          .filter(({ ingredient }) => isShoppable(ingredient.name))
          .map(({ ingredient, position }) => ({
            id: `${recipe.id}:${position}`,
            recipeId: recipe.id,
            name: ingredient.name,
            measure: ingredient.measure,
            bought: false,
          }))

        set((state) => ({
          recipes: [
            ...state.recipes,
            { id: recipe.id, name: recipe.name, thumbnail: recipe.thumbnail, servings },
          ],
          items: [...state.items, ...items],
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

/** Quantos itens a receita põe na lista: tudo menos água e gelo. */
export function shoppableCount(recipe: Pick<Recipe, 'ingredients'>): number {
  return recipe.ingredients.filter((ingredient) => isShoppable(ingredient.name)).length
}
