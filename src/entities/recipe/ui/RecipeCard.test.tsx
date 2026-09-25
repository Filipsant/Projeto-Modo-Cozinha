import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import type { Recipe } from '../model/recipe.types'
import { RecipeCard } from './RecipeCard'

const bolo: Recipe = {
  id: '1',
  name: 'Bolo',
  thumbnail: 'foto.jpg',
  instructions: '',
  steps: ['Mix.'],
  // Há receitas que repetem o ingrediente: açúcar na massa e na cobertura
  ingredients: [
    { name: 'Sugar', measure: '100g' },
    { name: 'Flour', measure: '200g' },
    { name: 'Sugar', measure: '2 tbs' },
    { name: 'Eggs', measure: '3' },
    { name: 'Butter', measure: '50g' },
  ],
  tags: [],
  estimatedMinutes: 30,
  difficulty: 'easy',
  methods: ['oven'],
}

describe('RecipeCard', () => {
  it('mostra cada ingrediente principal uma vez só, sem aviso de chave repetida', () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(<RecipeCard recipe={bolo} />)

    expect(screen.getAllByText('Açúcar')).toHaveLength(1)
    // Açúcar, Farinha de trigo e Ovos à vista; sobra só a manteiga
    expect(screen.getByText('+1')).toBeInTheDocument()
    expect(erro).not.toHaveBeenCalled()
  })
})
