import { describe, expect, it } from 'vitest'
import type { FavoriteRecipe } from '../model/favoritesStore'
import { selectFavorites, type FavoritesQuery } from './selectFavorites'

function favorita(parcial: Partial<FavoriteRecipe>): FavoriteRecipe {
  return {
    id: '1',
    name: 'Receita',
    thumbnail: 'foto.jpg',
    instructions: '',
    steps: [],
    ingredients: [],
    tags: [],
    estimatedMinutes: 20,
    difficulty: 'easy',
    methods: [],
    savedAt: 1,
    ...parcial,
  }
}

const favoritas = [
  favorita({ id: 'bolo', name: 'Bolo de Cenoura', estimatedMinutes: 60, savedAt: 3 }),
  favorita({
    id: 'omelete',
    name: 'Omelete',
    estimatedMinutes: 10,
    savedAt: 1,
    ingredients: [{ name: 'Eggs', measure: '3' }],
  }),
  favorita({ id: 'acai', name: 'Açaí na Tigela', estimatedMinutes: 15, savedAt: 2 }),
  favorita({ id: 'antiga', name: 'Antiga', estimatedMinutes: 0, savedAt: 0, partial: true }),
]

function selecionar(query: Partial<FavoritesQuery>): string[] {
  return selectFavorites([...favoritas], {
    term: '',
    view: 'recent',
    reversed: false,
    ...query,
  }).map((item) => item.id)
}

describe('selectFavorites', () => {
  it('mostra as salvas mais recentemente primeiro', () => {
    expect(selecionar({})).toEqual(['bolo', 'acai', 'omelete', 'antiga'])
  })

  it('ordena de A a Z e inverte para Z a A', () => {
    expect(selecionar({ view: 'alphabetical' })).toEqual(['acai', 'antiga', 'bolo', 'omelete'])
    expect(selecionar({ view: 'alphabetical', reversed: true })).toEqual([
      'omelete',
      'bolo',
      'antiga',
      'acai',
    ])
  })

  it('"rápidas" deixa só as de até 30 minutos, da mais rápida para a mais demorada', () => {
    expect(selecionar({ view: 'quick' })).toEqual(['omelete', 'acai'])
  })

  it('busca pelo nome sem acento e pelo ingrediente', () => {
    expect(selecionar({ term: 'acai' })).toEqual(['acai'])
    expect(selecionar({ term: 'EGG' })).toEqual(['omelete'])
  })

  it('não altera a lista original', () => {
    const original = favoritas.map((item) => item.id)

    selectFavorites(favoritas, { term: '', view: 'alphabetical', reversed: true })

    expect(favoritas.map((item) => item.id)).toEqual(original)
  })
})
