import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { useShoppingListStore } from '@/features/shopping-list'
import { renderWithProviders } from '@/shared/testing'
import { Header } from './Header'

describe('Header', () => {
  it('marca o link da rota atual', () => {
    renderWithProviders(<Header />, { route: '/favoritos' })

    expect(screen.getByRole('link', { name: 'Favoritos' })).toHaveAttribute('aria-current', 'page')
  })

  it('mostra quantos itens faltam comprar ao lado da lista de compras', () => {
    const receita = {
      id: '1',
      name: 'Bolo',
      thumbnail: 'foto.jpg',
      ingredients: [
        { name: 'Flour', measure: '200g' },
        { name: 'Eggs', measure: '3' },
      ],
    } as Recipe
    useShoppingListStore.setState({ recipes: [], items: [] })
    useShoppingListStore.getState().addRecipe(receita, 4)

    renderWithProviders(<Header />)

    expect(
      screen.getByRole('link', { name: 'Lista de compras, 2 itens pendentes' }),
    ).toBeInTheDocument()
  })
})
