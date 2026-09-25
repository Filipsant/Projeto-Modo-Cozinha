import { describe, expect, it } from 'vitest'
import { convertMeasure } from './convertMeasure'
import { parseMeasure } from './parseMeasure'

function converter(texto: string, factor: number, system: 'metric' | 'original') {
  return convertMeasure(parseMeasure(texto), { factor, system })
}

describe('convertMeasure', () => {
  it('multiplica pelas porções mantendo a unidade original', () => {
    expect(converter('1/2 cup', 2, 'original')).toMatchObject({ quantity: 1, unit: 'cup' })
    expect(converter('2-3', 2, 'original')).toMatchObject({ quantity: 4, quantityMax: 6 })
  })

  it('converte xícara, colher, onça e libra para ml e g', () => {
    expect(converter('3/4 cup', 1, 'metric')).toMatchObject({ quantity: 180, unit: 'ml' })
    expect(converter('3 tbsp', 1, 'metric')).toMatchObject({ quantity: 45, unit: 'ml' })
    expect(converter('½ tsp', 1, 'metric')).toMatchObject({ quantity: 2.5, unit: 'ml' })
    expect(converter('8 oz', 1, 'metric')).toMatchObject({ quantity: 225, unit: 'g' })
    expect(converter('1 lb', 1, 'metric')).toMatchObject({ quantity: 455, unit: 'g' })
  })

  it('passa para L e kg a partir de 1000', () => {
    expect(converter('5 cups', 1, 'metric')).toMatchObject({ quantity: 1.2, unit: 'l' })
    expect(converter('800g', 2, 'original')).toMatchObject({ quantity: 1.6, unit: 'kg' })
    expect(converter('1 kg', 0.25, 'metric')).toMatchObject({ quantity: 250, unit: 'g' })
  })

  it('converte as duas pontas de uma faixa com a mesma unidade', () => {
    expect(converter('4-5 cups', 1, 'metric')).toMatchObject({
      quantity: 0.95,
      quantityMax: 1.2,
      unit: 'l',
    })
  })

  it('só multiplica unidades de contagem e medidas sem unidade', () => {
    expect(converter('2 cloves', 1.5, 'metric')).toMatchObject({ quantity: 3, unit: 'clove' })
    expect(converter('1 large', 2, 'metric')).toMatchObject({ quantity: 2, unit: null })
  })

  it('deixa como está o que não tem número', () => {
    expect(converter('To taste', 2, 'metric')).toMatchObject({ quantity: null, note: 'To taste' })
  })
})
