import { describe, expect, it } from 'vitest'
import { clampServings } from './clampServings'

describe('clampServings', () => {
  it('aceita um inteiro dentro dos limites', () => {
    expect(clampServings('6')).toBe(6)
    expect(clampServings(1)).toBe(1)
  })

  it('encosta nos limites de 1 e 20 porções', () => {
    expect(clampServings('999')).toBe(20)
  })

  it('volta para 4 porções quando o valor não serve', () => {
    expect(clampServings(null)).toBe(4)
    expect(clampServings('')).toBe(4)
    expect(clampServings('abc')).toBe(4)
    expect(clampServings('2.5')).toBe(4)
    expect(clampServings('0')).toBe(4)
    expect(clampServings('-3')).toBe(4)
  })
})
