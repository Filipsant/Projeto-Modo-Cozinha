import { describe, expect, it } from 'vitest'
import { translateMeasureNote } from './translateMeasureNote'

describe('translateMeasureNote', () => {
  it('traduz frases inteiras, sem ligar para maiúsculas', () => {
    expect(translateMeasureNote('To taste', 'pt-BR', 1)).toBe('a gosto')
    expect(translateMeasureNote('Garnish', 'pt-BR', 1)).toBe('para decorar')
  })

  it('traduz palavra por palavra, no plural quando a quantidade pede', () => {
    expect(translateMeasureNote('large', 'pt-BR', 1)).toBe('grande')
    expect(translateMeasureNote('large', 'pt-BR', 3)).toBe('grandes')
    expect(translateMeasureNote('finely chopped', 'pt-BR', 1)).toBe('bem picado')
    expect(translateMeasureNote('peeled, crushed', 'pt-BR', 2)).toBe('descascados amassados')
  })

  it('devolve o original quando alguma palavra é desconhecida', () => {
    expect(translateMeasureNote('cut into wedges', 'pt-BR', 1)).toBe('cut into wedges')
  })

  it('em inglês fica como veio da API', () => {
    expect(translateMeasureNote('To taste', 'en', 1)).toBe('To taste')
    expect(translateMeasureNote('', 'pt-BR', 1)).toBe('')
  })
})
