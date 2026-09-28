import { describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { filterRecipes } from './filterRecipes'

function receita(parcial: Partial<Recipe>): Recipe {
  return {
    id: '1',
    name: 'Receita',
    thumbnail: 'foto.jpg',
    instructions: '',
    steps: [],
    ingredients: [],
    tags: [],
    estimatedMinutes: 10,
    difficulty: 'easy',
    methods: ['noCook'],
    ...parcial,
  }
}

const catalogo = [
  receita({ id: '1', name: 'Chicken Handi', category: 'Chicken', area: 'Indian' }),
  receita({ id: '2', name: 'Chinese Orange Chicken', category: 'Chicken', area: 'Chinese' }),
  receita({ id: '3', name: 'Tiramisu', category: 'Dessert', area: 'Italian' }),
  receita({
    id: '4',
    name: 'Pasta al Limone',
    category: 'Pasta',
    area: 'Italian',
    ingredients: [{ name: 'Açúcar', measure: '1 cup' }],
  }),
]

describe('filterRecipes', () => {
  it('sem filtro devolve tudo', () => {
    expect(filterRecipes(catalogo, { term: '', category: '', area: '' })).toHaveLength(4)
  })

  it('acha pelo meio do nome, não só pelo começo', () => {
    const achadas = filterRecipes(catalogo, { term: 'chicken', category: '', area: '' })

    expect(achadas.map((r) => r.id)).toEqual(['1', '2'])
  })

  it('acha por ingrediente e ignora acento', () => {
    const achadas = filterRecipes(catalogo, { term: 'acucar', category: '', area: '' })

    expect(achadas.map((r) => r.id)).toEqual(['4'])
  })

  it('combina categoria e origem', () => {
    const achadas = filterRecipes(catalogo, { term: '', category: 'Dessert', area: 'Italian' })

    expect(achadas.map((r) => r.id)).toEqual(['3'])
  })

  it('combina busca com filtro', () => {
    const achadas = filterRecipes(catalogo, { term: 'chicken', category: '', area: 'Chinese' })

    expect(achadas.map((r) => r.id)).toEqual(['2'])
  })
})

describe('filterRecipes por dificuldade', () => {
  const comDificuldade = [
    receita({ id: 'a', name: 'Omelete', difficulty: 'easy' }),
    receita({ id: 'b', name: 'Lasanha', difficulty: 'hard' }),
    receita({ id: 'c', name: 'Omelete Recheada', difficulty: 'medium' }),
  ]

  it('deixa só a dificuldade escolhida', () => {
    const achadas = filterRecipes(comDificuldade, {
      term: '',
      category: '',
      area: '',
      difficulty: 'hard',
    })

    expect(achadas.map((r) => r.id)).toEqual(['b'])
  })

  it('combina dificuldade com a busca', () => {
    const achadas = filterRecipes(comDificuldade, {
      term: 'omelete',
      category: '',
      area: '',
      difficulty: 'easy',
    })

    expect(achadas.map((r) => r.id)).toEqual(['a'])
  })
})
