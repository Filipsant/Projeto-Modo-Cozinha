import { describe, expect, it } from 'vitest'
import { estimateCookTimeMinutes } from './estimateCookTime'

describe('estimateCookTimeMinutes', () => {
  it('soma os tempos citados no texto', () => {
    const minutos = estimateCookTimeMinutes(['Fry for 10 minutes.', 'Bake for 20 mins.'])

    expect(minutos).toBe(30)
  })

  it('entende horas e faixas de tempo', () => {
    expect(estimateCookTimeMinutes(['Simmer for 1 hour.'])).toBe(60)
    expect(estimateCookTimeMinutes(['Cook for 30-40 mins.'])).toBe(30)
  })

  it('ignora números que não são tempo', () => {
    const minutos = estimateCookTimeMinutes(['Preheat oven to 350 F in a 9x13-inch pan.'])

    expect(minutos).toBe(5)
  })

  it('estima pelo número de passos quando não há tempo no texto', () => {
    const minutos = estimateCookTimeMinutes(['Chop.', 'Mix.', 'Serve.'])

    expect(minutos).toBe(15)
  })
})
