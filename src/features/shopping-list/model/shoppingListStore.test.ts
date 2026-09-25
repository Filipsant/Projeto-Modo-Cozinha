import { beforeEach, describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { shoppableCount, useShoppingListStore } from './shoppingListStore'

function receita(id: string, ...ingredientes: [string, string][]): Recipe {
  return {
    id,
    name: `Receita ${id}`,
    thumbnail: 'foto.jpg',
    instructions: '',
    steps: [],
    ingredients: ingredientes.map(([name, measure]) => ({ name, measure })),
    tags: [],
    estimatedMinutes: 10,
    difficulty: 'easy',
    methods: [],
  }
}

const store = () => useShoppingListStore.getState()
const bolo = receita('1', ['Flour', '200g'], ['Water', '1 cup'], ['Eggs', '3'])

beforeEach(() => {
  useShoppingListStore.setState({ recipes: [], items: [] })
  localStorage.clear()
})

describe('shoppingListStore', () => {
  it('adiciona os ingredientes da receita, menos a água', () => {
    store().addRecipe(bolo, 6)

    expect(store().recipes).toEqual([
      { id: '1', name: 'Receita 1', thumbnail: 'foto.jpg', servings: 6 },
    ])
    expect(store().items.map((item) => item.name)).toEqual(['Flour', 'Eggs'])
    expect(shoppableCount(bolo)).toBe(2)
  })

  it('adicionar de novo só atualiza as porções, sem perder o que já foi comprado', () => {
    store().addRecipe(bolo, 4)
    store().toggleItem('1:0')
    store().addRecipe(bolo, 8)

    expect(store().recipes[0].servings).toBe(8)
    expect(store().items).toHaveLength(2)
    expect(store().items[0].bought).toBe(true)
  })

  it('remove uma receita com todos os itens dela', () => {
    store().addRecipe(bolo, 4)
    store().addRecipe(receita('2', ['Rice', '1 cup']), 4)
    store().removeRecipe('1')

    expect(store().recipes.map((recipe) => recipe.id)).toEqual(['2'])
    expect(store().items.map((item) => item.name)).toEqual(['Rice'])
  })

  it('limpar comprados tira também a receita que ficou sem itens', () => {
    store().addRecipe(bolo, 4)
    store().addRecipe(receita('2', ['Rice', '1 cup']), 4)
    store().toggleItem('2:0')
    store().clearBought()

    expect(store().items.map((item) => item.name)).toEqual(['Flour', 'Eggs'])
    expect(store().recipes.map((recipe) => recipe.id)).toEqual(['1'])
  })

  it('persiste com nome e versão', () => {
    store().addRecipe(bolo, 4)

    expect(JSON.parse(localStorage.getItem('modo-cozinha:shopping-list')!)).toMatchObject({
      version: 1,
    })
  })

  it('esvazia a lista', () => {
    store().addRecipe(bolo, 4)
    store().clear()

    expect(store().items).toEqual([])
    expect(store().recipes).toEqual([])
  })
})
