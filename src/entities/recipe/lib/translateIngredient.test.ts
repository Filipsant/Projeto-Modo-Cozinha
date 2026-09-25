import { describe, expect, it } from 'vitest'
import { translateIngredient } from './translateIngredient'

describe('translateIngredient', () => {
  it('traduz para português com a primeira letra maiúscula', () => {
    expect(translateIngredient('garlic', 'pt-BR')).toBe('Alho')
    expect(translateIngredient('olive oil', 'pt-BR')).toBe('Azeite')
  })

  it('ignora a caixa e os espaços que vêm da API', () => {
    expect(translateIngredient('  Chicken Breast ', 'pt-BR')).toBe('Peito de frango')
  })

  it('devolve o nome original quando não está no dicionário', () => {
    expect(translateIngredient('Galangal', 'pt-BR')).toBe('Galangal')
  })

  it('em inglês não traduz nada', () => {
    expect(translateIngredient('garlic', 'en')).toBe('garlic')
  })
})
