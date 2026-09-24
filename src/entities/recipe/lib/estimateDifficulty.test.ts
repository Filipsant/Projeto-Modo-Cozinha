import { describe, expect, it } from 'vitest'
import { estimateDifficulty } from './estimateDifficulty'

describe('estimateDifficulty', () => {
  it('receita curta é fácil', () => {
    expect(estimateDifficulty({ ingredientCount: 5, stepCount: 4 })).toBe('easy')
  })

  it('receita média fica no meio', () => {
    expect(estimateDifficulty({ ingredientCount: 9, stepCount: 6 })).toBe('medium')
  })

  it('muitos ingredientes e passos viram difícil', () => {
    expect(estimateDifficulty({ ingredientCount: 15, stepCount: 10 })).toBe('hard')
  })
})
