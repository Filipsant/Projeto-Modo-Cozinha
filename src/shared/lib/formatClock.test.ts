import { describe, expect, it } from 'vitest'
import { formatClock } from './formatClock'

describe('formatClock', () => {
  it('mostra minutos e segundos com dois dígitos', () => {
    expect(formatClock(222_000)).toBe('03:42')
    expect(formatClock(9 * 60_000)).toBe('09:00')
  })

  it('mostra horas a partir de uma hora', () => {
    expect(formatClock(65 * 60_000)).toBe('1:05:00')
  })

  it('arredonda para cima e nunca fica negativo', () => {
    expect(formatClock(59_001)).toBe('01:00')
    expect(formatClock(1)).toBe('00:01')
    expect(formatClock(-500)).toBe('00:00')
  })
})
