import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { toRecipe } from '@/entities/recipe'
import { API_BASE_URL } from '@/shared/config'
import { fixtures, renderWithProviders, server } from '@/shared/testing'
import { HomePage } from './HomePage'

const ESPERA_DA_BUSCA = { timeout: 3000 }

describe('HomePage', () => {
  it('mostra o título da página', () => {
    renderWithProviders(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'O que vamos preparar hoje?' }),
    ).toBeInTheDocument()
  })

  it('lista as receitas da seleção inicial', async () => {
    renderWithProviders(<HomePage />)

    expect(
      await screen.findByRole('link', { name: 'Chicken Handi' }, ESPERA_DA_BUSCA),
    ).toBeVisible()
    expect(screen.getByText('25 receitas encontradas')).toBeInTheDocument()
  })

  it('busca ao digitar e avisa quando não encontra nada', async () => {
    const { user } = renderWithProviders(<HomePage />)
    await screen.findByRole('link', { name: 'Chicken Handi' }, ESPERA_DA_BUSCA)

    await user.type(screen.getByRole('searchbox'), 'zzzzzz')

    expect(
      await screen.findByText(
        'Tente ajustar seus termos ou explore categorias sugeridas.',
        {},
        ESPERA_DA_BUSCA,
      ),
    ).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma receita encontrada')
  })

  it('mostra erro com botão de tentar de novo quando a API falha', async () => {
    server.use(
      http.get(`${API_BASE_URL}/search.php`, () => new HttpResponse(null, { status: 500 })),
    )
    renderWithProviders(<HomePage />)

    expect(await screen.findByRole('alert', {}, ESPERA_DA_BUSCA)).toHaveTextContent(
      'Falha ao sincronizar',
    )
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeInTheDocument()
  })

  it('guarda a busca na URL', async () => {
    const { user, router } = renderWithProviders(<HomePage />)

    await user.type(screen.getByRole('searchbox'), 'chicken')

    await waitFor(() => expect(router.state.location.search).toBe('?q=chicken'), ESPERA_DA_BUSCA)
  })

  it('filtra pela dificuldade, como as tags dos cartões', async () => {
    const { user, router } = renderWithProviders(<HomePage />)
    // Nos testes, o catálogo são as 25 receitas da busca por "chicken"
    const faceis = fixtures.searchChicken.meals
      .map((meal) => toRecipe(meal as Parameters<typeof toRecipe>[0]))
      .filter((recipe) => recipe.difficulty === 'easy').length

    await user.click(screen.getByRole('combobox', { name: 'Dificuldade' }))
    await user.click(await screen.findByRole('option', { name: /^Fácil/ }, ESPERA_DA_BUSCA))

    expect(router.state.location.search).toBe('?dificuldade=easy')
    expect(
      await screen.findByText(`${faceis} receitas encontradas`, {}, ESPERA_DA_BUSCA),
    ).toBeInTheDocument()
  })
})
