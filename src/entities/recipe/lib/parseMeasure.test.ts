import { describe, expect, it } from 'vitest'
import { parseMeasure } from './parseMeasure'

describe('parseMeasure', () => {
  it.each([
    ['1 tsp', 1, 'tsp'],
    ['2 tablespoons', 2, 'tbsp'],
    ['3  Tablespoons', 3, 'tbsp'],
    ['2 tblsp', 2, 'tbsp'],
    ['1/2 cup', 0.5, 'cup'],
    ['1 1/2 cups', 1.5, 'cup'],
    ['½ tsp', 0.5, 'tsp'],
    ['1 ½ tbsp', 1.5, 'tbsp'],
    ['1½ cup', 1.5, 'cup'],
    ['200g', 200, 'g'],
    ['1.5 kg', 1.5, 'kg'],
    ['1,5 kg', 1.5, 'kg'],
    ['1 L', 1, 'l'],
    ['2 Lbs', 2, 'lb'],
    ['8 oz.', 8, 'oz'],
    ['4 fl oz', 4, 'floz'],
  ])('"%s" vira %s %s', (texto, quantity, unit) => {
    expect(parseMeasure(texto)).toMatchObject({ quantity, unit, note: '' })
  })

  it('guarda o que sobra como nota', () => {
    expect(parseMeasure('2 cloves minced')).toEqual({
      quantity: 2,
      quantityMax: null,
      unit: 'clove',
      note: 'minced',
    })
    expect(parseMeasure('1 large')).toMatchObject({ quantity: 1, unit: null, note: 'large' })
    expect(parseMeasure('1 (12 oz.)')).toMatchObject({ quantity: 1, unit: null, note: '(12 oz.)' })
  })

  it('entende quantidade sem unidade e faixas', () => {
    expect(parseMeasure('3')).toMatchObject({ quantity: 3, unit: null })
    expect(parseMeasure('2-3')).toMatchObject({ quantity: 2, quantityMax: 3 })
    expect(parseMeasure('2 to 3 cups')).toMatchObject({ quantity: 2, quantityMax: 3, unit: 'cup' })
  })

  it('"Pinch" e "Handful" sozinhos valem uma unidade', () => {
    expect(parseMeasure('Pinch')).toMatchObject({ quantity: 1, unit: 'pinch' })
    expect(parseMeasure('Handful')).toMatchObject({ quantity: 1, unit: 'handful' })
  })

  it('deixa sem número o que não é quantidade', () => {
    expect(parseMeasure('To taste')).toEqual({
      quantity: null,
      quantityMax: null,
      unit: null,
      note: 'To taste',
    })
    expect(parseMeasure('')).toMatchObject({ quantity: null, note: '' })
  })

  it('entende "Juice of 1" e variações, com número por extenso', () => {
    expect(parseMeasure('Juice of 1')).toMatchObject({ quantity: 1, unit: 'juice' })
    expect(parseMeasure('Zest and juice of 2')).toMatchObject({
      quantity: 2,
      unit: 'zestAndJuice',
    })
    expect(parseMeasure('Juice/zest of one')).toMatchObject({ quantity: 1, unit: 'zestAndJuice' })
    expect(parseMeasure('Grated Zest of 2')).toMatchObject({ quantity: 2, unit: 'zest' })
  })

  it('fica com a primeira de duas medidas, como em "75g/3oz"', () => {
    expect(parseMeasure('75g/3oz')).toMatchObject({ quantity: 75, unit: 'g', note: '' })
    expect(parseMeasure('50ml/2fl oz')).toMatchObject({ quantity: 50, unit: 'ml', note: '' })
  })

  it('não quebra com divisão por zero', () => {
    expect(parseMeasure('1/0 cup')).toMatchObject({ quantity: 1, unit: 'cup' })
  })
})
