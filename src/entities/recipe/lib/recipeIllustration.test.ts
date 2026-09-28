import { describe, expect, it } from 'vitest'
import { illustrationFor } from './recipeIllustration'

describe('illustrationFor', () => {
  it('olha primeiro o nome da receita', () => {
    expect(illustrationFor({ name: 'Chicken Soup', category: 'Chicken' })).toBe('soup')
    expect(illustrationFor({ name: 'Spicy Arrabiata Penne', category: 'Vegetarian' })).toBe('pasta')
    expect(illustrationFor({ name: 'Chocolate Cake', category: 'Dessert' })).toBe('chocolate')
    expect(illustrationFor({ name: 'Baked salmon with fennel', category: 'Seafood' })).toBe('fish')
  })

  it('acha a palavra inteira, e não pedaço de outra', () => {
    // "pot" dentro de "potato" não é panela
    expect(illustrationFor({ name: 'Potato Gratin', category: 'Side' })).toBe('potato')
    expect(illustrationFor({ name: 'Cheesecake', category: 'Dessert' })).toBe('cake')
  })

  it('cai na categoria quando o nome não diz nada', () => {
    expect(illustrationFor({ name: 'Teriyaki Chicken Casserole', category: 'Chicken' })).toBe('pot')
    expect(illustrationFor({ name: 'Kafteji', category: 'Vegetarian' })).toBe('salad')
    expect(illustrationFor({ name: 'Tourtiere', category: 'Pork' })).toBe('bacon')
  })

  it('usa a tigela quando não há pista nenhuma', () => {
    expect(illustrationFor({ name: 'Kumpir' })).toBe('bowl')
  })
})
