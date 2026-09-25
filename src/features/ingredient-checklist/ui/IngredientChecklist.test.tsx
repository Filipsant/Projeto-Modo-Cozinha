import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import { IngredientChecklist } from './IngredientChecklist'

const ingredientes = [
  { name: 'Garlic', measure: '2 cloves' },
  { name: 'Onion', measure: '1' },
  { name: 'Saffron', measure: '' },
]

describe('IngredientChecklist', () => {
  it('conta os ingredientes marcados', async () => {
    const { user } = renderWithProviders(<IngredientChecklist ingredients={ingredientes} />)

    await user.click(screen.getByRole('checkbox', { name: /alho/i }))

    expect(screen.getByRole('checkbox', { name: /alho/i })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('1 de 3 separados')
  })

  it('marca e desmarca todos de uma vez', async () => {
    const { user } = renderWithProviders(<IngredientChecklist ingredients={ingredientes} />)

    await user.click(screen.getByRole('button', { name: 'Marcar todos' }))

    expect(screen.getByRole('status')).toHaveTextContent('3 de 3 separados')
    expect(
      screen.getAllByRole('checkbox').every((caixa) => (caixa as HTMLInputElement).checked),
    ).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Desmarcar todos' }))

    expect(screen.getByRole('status')).toHaveTextContent('0 de 3 separados')
  })

  it('mostra a medida só quando a API informa', () => {
    renderWithProviders(<IngredientChecklist ingredients={ingredientes} />)

    expect(screen.getByRole('checkbox', { name: 'Alho 2 dentes' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Açafrão' })).toBeInTheDocument()
  })
})
