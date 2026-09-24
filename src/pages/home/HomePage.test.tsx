import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('mostra o título da página inicial', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Início' })).toBeInTheDocument()
  })
})
