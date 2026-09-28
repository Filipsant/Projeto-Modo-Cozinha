import { describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { buildTrending } from './buildTrending'

function receita(id: string, name = `Receita ${id}`): Recipe {
  return {
    id,
    name,
    thumbnail: '',
    instructions: '',
    steps: [],
    ingredients: [],
    tags: [],
    estimatedMinutes: 20,
    difficulty: 'easy',
    methods: [],
  }
}

const catalogo = ['1', '2', '3', '4', '5', '6'].map((id) => receita(id))

describe('buildTrending', () => {
  it('põe as mais clicadas primeiro, numeradas', () => {
    const itens = buildTrending(catalogo, { '3': 5, '1': 9 }, 4)

    expect(itens.slice(0, 2)).toMatchObject([
      { recipe: { id: '1' }, clicks: 9, rank: 1 },
      { recipe: { id: '3' }, clicks: 5, rank: 2 },
    ])
  })

  it('completa com sugestões sem posição, sem repetir receita', () => {
    const itens = buildTrending(catalogo, { '3': 5 }, 4)
    const ids = itens.map((item) => item.recipe.id)

    expect(itens).toHaveLength(4)
    expect(new Set(ids).size).toBe(4)
    expect(itens.slice(1).every((item) => item.rank === null && item.clicks === 0)).toBe(true)
  })

  it('sem nenhum clique, mostra só sugestões, sempre na mesma ordem', () => {
    const primeira = buildTrending(catalogo, {}, 3).map((item) => item.recipe.id)
    const segunda = buildTrending([...catalogo].reverse(), {}, 3).map((item) => item.recipe.id)

    expect(primeira).toEqual(segunda)
  })

  it('empata pelo nome', () => {
    const itens = buildTrending([receita('1', 'Bolo'), receita('2', 'Arroz')], { '1': 2, '2': 2 })

    expect(itens.map((item) => item.recipe.name)).toEqual(['Arroz', 'Bolo'])
  })
})
