import { describe, expect, it } from 'vitest'
import { uniqueIngredients } from './uniqueIngredients'

describe('uniqueIngredients', () => {
  it('fica com a primeira ocorrência de cada ingrediente', () => {
    const ingredientes = uniqueIngredients([
      { name: 'Sugar', measure: '100g' },
      { name: 'Flour', measure: '200g' },
      { name: 'sugar ', measure: '2 tbs' },
    ])

    expect(ingredientes).toEqual([
      { name: 'Sugar', measure: '100g' },
      { name: 'Flour', measure: '200g' },
    ])
  })
})
