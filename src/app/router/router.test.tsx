import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { createTestQueryClient } from '@/shared/testing'
import { routes } from './router'

function renderRoute(route: string) {
  const router = createMemoryRouter(routes, { initialEntries: [route] })

  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('rotas', () => {
  it.each([
    ['/', 'O que vamos preparar hoje?'],
    ['/receita/52772', 'Receita'],
    ['/receita/52772/cozinhar', 'Modo cozinha'],
    ['/favoritos', 'Favoritos'],
    ['/lista-de-compras', 'Lista de compras'],
    ['/rota-que-nao-existe', 'Página não encontrada'],
  ])('%s abre a página "%s"', async (route, title) => {
    renderRoute(route)

    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })
})
