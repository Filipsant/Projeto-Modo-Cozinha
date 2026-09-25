import { describe, expect, it } from 'vitest'
import { formatQuantity } from './formatQuantity'

const fracao = (value: number) => formatQuantity(value, { style: 'fraction', language: 'pt-BR' })

describe('formatQuantity', () => {
  it('mostra frações de xícara e colher', () => {
    expect(fracao(0.5)).toBe('½')
    expect(fracao(1.5)).toBe('1 ½')
    expect(fracao(0.75)).toBe('¾')
    expect(fracao(1 / 3)).toBe('⅓')
    expect(fracao(2)).toBe('2')
  })

  it('arredonda para a fração de medidor mais próxima', () => {
    // 3/4 de xícara para 3 porções, em vez de 4
    expect(fracao(0.5625)).toBe('½')
    expect(fracao(1.97)).toBe('2')
  })

  it('não deixa uma quantidade pequena virar zero', () => {
    expect(fracao(0.04)).toBe('⅛')
    expect(fracao(0)).toBe('0')
  })

  it('usa decimal no formato de cada idioma para g, ml, kg e L', () => {
    expect(formatQuantity(1.5, { style: 'decimal', language: 'pt-BR' })).toBe('1,5')
    expect(formatQuantity(1.5, { style: 'decimal', language: 'en' })).toBe('1.5')
    expect(formatQuantity(250, { style: 'decimal', language: 'pt-BR' })).toBe('250')
  })
})
