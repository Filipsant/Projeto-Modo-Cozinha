import { describe, expect, it } from 'vitest'
import { clampStep, progressPercent } from './clampStep'

describe('clampStep', () => {
  it('aceita um passo válido', () => {
    expect(clampStep('3', 6)).toBe(3)
  })

  it('não passa do último passo', () => {
    expect(clampStep('6', 6)).toBe(6)
    expect(clampStep('99', 6)).toBe(6)
  })

  it('volta para o primeiro quando o valor não serve', () => {
    expect(clampStep(null, 6)).toBe(1)
    expect(clampStep('abc', 6)).toBe(1)
    expect(clampStep('0', 6)).toBe(1)
    expect(clampStep('2.5', 6)).toBe(1)
  })
})

describe('progressPercent', () => {
  it('passo 3 de 6 é 50%', () => {
    expect(progressPercent(3, 6)).toBe(50)
    expect(progressPercent(1, 3)).toBe(33)
  })

  it('não passa de 100% e trata receita sem passos', () => {
    expect(progressPercent(7, 6)).toBe(100)
    expect(progressPercent(1, 0)).toBe(100)
  })
})
