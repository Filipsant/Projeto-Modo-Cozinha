import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import { Header } from './Header'

describe('Header', () => {
  it('marca o link da rota atual', () => {
    renderWithProviders(<Header />, { route: '/favoritos' })

    expect(screen.getByRole('link', { name: 'Favoritos' })).toHaveAttribute('aria-current', 'page')
  })
})
