import { describe, expect, it } from 'vitest'
import { detectCookingMethods } from './detectCookingMethods'

describe('detectCookingMethods', () => {
  it('põe primeiro o método que mais passos citam', () => {
    const steps = [
      'Preheat oven to 180C.',
      'Fry the onions in a pan.',
      'Simmer for 20 minutes.',
      'Bake for 30 minutes.',
      'Remove from the oven.',
    ]

    expect(detectCookingMethods(steps)).toEqual(['oven', 'stovetop'])
  })

  it('não conta a fôrma de assar como fogão', () => {
    expect(detectCookingMethods(['Grease a baking pan.', 'Bake until golden.'])).toEqual(['oven'])
  })

  it('reconhece a grelha', () => {
    expect(detectCookingMethods(['Grill the steaks for 4 minutes each side.'])).toEqual(['grill'])
  })

  it('conta o passo que leva a panela ao forno como forno', () => {
    const steps = ['Place the chicken in the pan and bake for 35 minutes.', 'Boil the rice.']

    expect(detectCookingMethods(steps)).toEqual(['oven', 'stovetop'])
  })

  it('mostra no máximo dois métodos', () => {
    const steps = ['Boil the potatoes.', 'Boil the eggs.', 'Roast the peppers.', 'Grill the fish.']

    expect(detectCookingMethods(steps)).toEqual(['stovetop', 'oven'])
  })

  it('diz que não vai ao fogo quando nenhum passo cita calor', () => {
    expect(detectCookingMethods(['Chop the fruit.', 'Mix with yogurt.'])).toEqual(['noCook'])
  })
})
