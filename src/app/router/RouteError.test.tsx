import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import { RouteError } from './RouteError'

function BrokenPage(): never {
  throw new Error('Falha inesperada')
}

describe('RouteError', () => {
  it('mostra a tela de erro com caminho de volta quando uma página quebra', async () => {
    // O React registra o erro capturado no console; aqui ele é esperado
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const router = createMemoryRouter([
      { path: '/', Component: BrokenPage, ErrorBoundary: RouteError },
    ])

    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para o início' })).toHaveAttribute('href', '/')
  })
})
