import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { useFavoritesStore, type FavoriteRecipe } from '@/features/favorite-recipe'
import { renderWithProviders } from '@/shared/testing'
import { FavoritesPage } from './FavoritesPage'

function receita(id: string, name: string, estimatedMinutes: number): Recipe {
  return {
    id,
    name,
    thumbnail: 'foto.jpg',
    area: 'Italy',
    instructions: 'Cook.',
    steps: ['Cook.'],
    ingredients: [{ name: 'Eggs', measure: '2' }],
    tags: [],
    estimatedMinutes,
    difficulty: 'easy',
    methods: ['stovetop'],
  }
}

function salvar(...items: FavoriteRecipe[]) {
  useFavoritesStore.setState({ items, lastRemoved: null })
}

// A lista visível, na ordem da tela
function nomes(): string[] {
  return within(screen.getByRole('list'))
    .getAllByRole('heading', { level: 3 })
    .map((titulo) => titulo.textContent ?? '')
}

beforeEach(() => {
  salvar()
  localStorage.clear()
})

describe('FavoritesPage', () => {
  it('convida a explorar quando ainda não há favoritas', () => {
    renderWithProviders(<FavoritesPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Receitas Favoritas' })).toBeVisible()
    expect(screen.getByText('Nenhuma receita salva ainda')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar receitas/i })).toHaveAttribute('href', '/')
  })

  it('lista as favoritas, da mais recente para a mais antiga', () => {
    salvar(
      { ...receita('1', 'Lasanha', 90), savedAt: 1 },
      { ...receita('2', 'Omelete', 10), savedAt: 2 },
    )
    renderWithProviders(<FavoritesPage />)

    expect(screen.getByText('2 salvas')).toBeInTheDocument()
    expect(nomes()).toEqual(['Omelete', 'Lasanha'])
    expect(screen.getAllByRole('link', { name: /cozinhar agora/i })[0]).toHaveAttribute(
      'href',
      '/receita/2/cozinhar',
    )
  })

  it('ordena de A a Z, inverte e filtra as rápidas', async () => {
    salvar(
      { ...receita('1', 'Omelete', 10), savedAt: 3 },
      { ...receita('2', 'Lasanha', 90), savedAt: 2 },
      { ...receita('3', 'Bruschetta', 15), savedAt: 1 },
    )
    const { user } = renderWithProviders(<FavoritesPage />)

    await user.click(screen.getByRole('button', { name: 'A–Z' }))
    expect(nomes()).toEqual(['Bruschetta', 'Lasanha', 'Omelete'])

    await user.click(screen.getByRole('button', { name: 'Inverter ordem' }))
    expect(nomes()).toEqual(['Omelete', 'Lasanha', 'Bruschetta'])

    await user.click(screen.getByRole('button', { name: 'Inverter ordem' }))
    await user.click(screen.getByRole('button', { name: /rápidas/i }))
    expect(nomes()).toEqual(['Omelete', 'Bruschetta'])
    expect(screen.getByRole('button', { name: /rápidas/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('busca nas favoritas e oferece voltar para todas quando não acha', async () => {
    salvar({ ...receita('1', 'Omelete', 10), savedAt: 1 })
    const { user } = renderWithProviders(<FavoritesPage />)

    await user.type(screen.getByRole('searchbox'), 'feijoada')

    expect(screen.getByText('Nenhuma favorita encontrada')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma receita encontrada')

    await user.click(screen.getByRole('button', { name: 'Ver todas as favoritas' }))

    expect(nomes()).toEqual(['Omelete'])
  })

  it('completa pela API uma favorita salva só com nome e foto', async () => {
    salvar({
      ...receita('52772', 'Teriyaki Chicken Casserole', 0),
      steps: [],
      ingredients: [],
      savedAt: 1,
      partial: true,
    })
    renderWithProviders(<FavoritesPage />)

    // O tempo só aparece depois que a receita completa chega
    expect(await screen.findByText('9 ingredientes')).toBeInTheDocument()
    expect(useFavoritesStore.getState().items[0].partial).toBeUndefined()
  })
})
