import { describe, expect, it } from 'vitest'
import type { Ingredient } from '../model/recipe.types'
import { highlightIngredients, ingredientsInStep } from './ingredientsInStep'

function ingredients(...names: string[]): Ingredient[] {
  return names.map((name) => ({ name, measure: '' }))
}

function names(step: string, list: Ingredient[]): string[] {
  return ingredientsInStep(step, list).map((ingredient) => ingredient.name)
}

describe('ingredientsInStep', () => {
  it('acha os ingredientes citados, na ordem da receita', () => {
    const list = ingredients('soy sauce', 'water', 'brown sugar', 'ground ginger', 'minced garlic')

    expect(names('Combine soy sauce, water, brown sugar, ginger and garlic.', list)).toEqual([
      'soy sauce',
      'water',
      'brown sugar',
      'ground ginger',
      'minced garlic',
    ])
  })

  it('aceita singular e plural', () => {
    const list = ingredients('Onions', 'Tomato', 'Bay Leaves', 'Berries')

    expect(names('Slice the onion and add the tomatoes.', list)).toEqual(['Onions', 'Tomato'])
    expect(names('Add a bay leaf and the berries.', list)).toEqual(['Bay Leaves', 'Berries'])
  })

  it('procura o alimento, e não a forma, em "garlic clove"', () => {
    const list = ingredients('Garlic Clove', 'Cinnamon Stick')

    expect(names('Crush the garlic and add the cinnamon.', list)).toEqual([
      'Garlic Clove',
      'Cinnamon Stick',
    ])
  })

  it('não confunde palavras parecidas', () => {
    const list = ingredients('Salt', 'Cloves')

    expect(names('Use salted butter.', list)).toEqual([])
    expect(names('Add the cloves.', list)).toEqual(['Cloves'])
  })

  it('usa a primeira palavra só quando nenhum outro ingrediente tem esse nome', () => {
    const soFrango = ingredients('chicken breasts', 'rice')
    const frangoECaldo = ingredients('Chicken', 'Chicken Stock')

    expect(names('Shred the chicken.', soFrango)).toEqual(['chicken breasts'])
    expect(names('Add the chicken.', frangoECaldo)).toEqual(['Chicken'])
  })

  it('não usa adjetivos soltos para achar ingrediente', () => {
    const list = ingredients('Red Onion', 'Fresh Basil')

    expect(names('Add the red wine and fresh thyme.', list)).toEqual([])
  })
})

describe('highlightIngredients', () => {
  it('marca onde cada ingrediente aparece, preferindo o nome inteiro', () => {
    const list = ingredients('soy sauce', 'Onions')

    expect(highlightIngredients('Add the soy sauce and the onions.', list)).toEqual([
      { text: 'Add the ', ingredient: false },
      { text: 'soy sauce', ingredient: true },
      { text: ' and the ', ingredient: false },
      { text: 'onions', ingredient: true },
      { text: '.', ingredient: false },
    ])
  })

  it('devolve o texto inteiro quando o passo não cita ingrediente', () => {
    expect(highlightIngredients('Preheat the oven.', ingredients('Salt'))).toEqual([
      { text: 'Preheat the oven.', ingredient: false },
    ])
  })

  it('no passo traduzido, procura os nomes em português, sem ligar para acento', () => {
    const list = ingredients('soy sauce', 'Brown Sugar')
    const passo = 'Misture o molho de soja e o Açúcar mascavo.'

    expect(highlightIngredients(passo, list, 'pt')).toEqual([
      { text: 'Misture o ', ingredient: false },
      { text: 'molho de soja', ingredient: true },
      { text: ' e o ', ingredient: false },
      { text: 'Açúcar mascavo', ingredient: true },
      { text: '.', ingredient: false },
    ])
  })

  it('em português, acha o plural e a palavra principal do nome', () => {
    const list = ingredients('Chicken Breast', 'Garlic Clove')
    const passo = 'Coloque os peitos de frango e o alho. Desfie o frango.'

    const destacados = highlightIngredients(passo, list, 'pt')
      .filter((segment) => segment.ingredient)
      .map((segment) => segment.text)

    expect(destacados).toEqual(['peitos de frango', 'alho', 'frango'])
  })
})
