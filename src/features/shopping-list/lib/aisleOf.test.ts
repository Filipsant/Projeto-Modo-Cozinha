import { describe, expect, it } from 'vitest'
import { aisleOf, isShoppable } from './aisleOf'

describe('aisleOf', () => {
  it.each([
    ['Onion', 'produce'],
    ['Garlic Clove', 'produce'],
    ['Red Pepper', 'produce'],
    ['Chicken Thighs', 'butcher'],
    ['Minced Beef', 'butcher'],
    ['Salmon', 'seafood'],
    ['Double Cream', 'dairy'],
    ['Parmigiano-Reggiano', 'dairy'],
    ['Eggs', 'dairy'],
    ['Breadcrumbs', 'bakery'],
    ['Spaghetti', 'grains'],
    ['Plain Flour', 'grains'],
    ['Coconut Milk', 'canned'],
    ['Paprika', 'spices'],
    ['Olive Oil', 'pantry'],
    ['Red Wine', 'drinks'],
    ['Dulce de leche', 'other'],
  ])('%s fica em %s', (nome, corredor) => {
    expect(aisleOf(nome)).toBe(corredor)
  })

  it('resolve os nomes que caberiam em dois corredores', () => {
    // Caldo de frango é enlatado, e não açougue
    expect(aisleOf('Chicken Stock')).toBe('canned')
    // Pimenta-do-reino é tempero, e não pimentão
    expect(aisleOf('Black Pepper')).toBe('spices')
    expect(aisleOf('Pepper')).toBe('spices')
    // Macarrão de ovo é massa, e não ovo
    expect(aisleOf('Egg Noodles')).toBe('grains')
    // Pasta de amendoim é despensa, e não manteiga
    expect(aisleOf('Peanut Butter')).toBe('canned')
    // Gengibre em pó é tempero; gengibre fresco é hortifrúti
    expect(aisleOf('Ground Ginger')).toBe('spices')
    expect(aisleOf('Ginger')).toBe('produce')
  })
})

describe('isShoppable', () => {
  it('deixa água e gelo fora da lista', () => {
    expect(isShoppable('Water')).toBe(false)
    expect(isShoppable('boiling water')).toBe(false)
    expect(isShoppable('Ice')).toBe(false)
    expect(isShoppable('Coconut Water')).toBe(true)
    expect(isShoppable('Onion')).toBe(true)
  })
})
