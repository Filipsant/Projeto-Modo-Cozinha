import { describe, expect, it } from 'vitest'
import { estimateCookTimeMinutes, splitDuration, stepMinutes } from './estimateCookTime'

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

  it('não conta o tempo em que a comida só espera', () => {
    const minutos = estimateCookTimeMinutes([
      'Marinate the chicken overnight, or for at least 24 hours.',
      'Leave the dough to rise for 2 hours.',
      'Soak the beans for 8 hours.',
      'Grill for 20 minutes.',
    ])

    expect(minutos).toBe(20)
  })

  it('nunca fica abaixo de 5 minutos por passo', () => {
    const minutos = estimateCookTimeMinutes([
      'Chill for 24 hours.',
      'Shape the croquetas.',
      'Coat in breadcrumbs.',
      'Fry for 30 seconds.',
    ])

    expect(minutos).toBe(20)
  })
})

describe('stepMinutes', () => {
  it('soma os tempos que o passo cita, inclusive a espera', () => {
    expect(stepMinutes('Return to oven and cook 15 minutes. Let stand 5 minutes.')).toBe(20)
    expect(stepMinutes('Marinate for 2 hours.')).toBe(120)
  })

  it('arredonda segundos para pelo menos 1 minuto', () => {
    expect(stepMinutes('Fry for 30 seconds.')).toBe(1)
  })

  it('devolve null quando o passo não fala de tempo', () => {
    expect(stepMinutes('Chop the onions.')).toBeNull()
  })
})

describe('splitDuration', () => {
  it('separa horas e minutos', () => {
    expect(splitDuration(90)).toEqual({ hours: 1, minutes: 30 })
    expect(splitDuration(120)).toEqual({ hours: 2, minutes: 0 })
    expect(splitDuration(45)).toEqual({ hours: 0, minutes: 45 })
  })
})
