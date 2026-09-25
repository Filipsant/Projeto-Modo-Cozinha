import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import type { Recipe } from '../model/recipe.types'
import { RecipeCard } from './RecipeCard'

const bolo: Recipe = {
  id: '7',
  name: 'Bolo de Cenoura',
  thumbnail: 'foto.jpg',
  area: 'Brazil',
  instructions: '',
  steps: ['Mix.', 'Bake.'],
  ingredients: [
    { name: 'Carrots', measure: '3' },
    { name: 'Flour', measure: '200g' },
  ],
  tags: [],
  estimatedMinutes: 45,
  difficulty: 'medium',
  methods: ['oven'],
}

describe('RecipeCard', () => {
  it('mostra origem, nome, tempo, ingredientes e dificuldade', () => {
    renderWithProviders(<RecipeCard recipe={bolo} />)

    expect(screen.getByText('Brasil')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Bolo de Cenoura' })).toHaveAttribute(
      'href',
      '/receita/7',
    )
    expect(screen.getByText('~45 min')).toBeInTheDocument()
    expect(screen.getByText('2 ingredientes')).toBeInTheDocument()
    expect(screen.getByText('Médio')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /cozinhar agora/i })).toHaveAttribute(
      'href',
      '/receita/7/cozinhar',
    )
  })

  it('recebe os botões de fora, como o favorito', () => {
    renderWithProviders(
      <RecipeCard recipe={bolo} actions={<button type="button">Salvar</button>} />,
    )

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('esconde tempo e dificuldade quando a receita ainda não tem os detalhes', () => {
    renderWithProviders(<RecipeCard recipe={{ ...bolo, steps: [], estimatedMinutes: 0 }} />)

    expect(screen.queryByText('~45 min')).not.toBeInTheDocument()
    expect(screen.queryByText('Médio')).not.toBeInTheDocument()
  })
})
