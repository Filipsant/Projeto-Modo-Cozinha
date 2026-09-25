import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import { ServingsStepper } from './ServingsStepper'

function renderizar(route = '/receita/1') {
  return renderWithProviders(
    <>
      <h2 id="titulo">Rendimento da Receita</h2>
      <ServingsStepper labelledBy="titulo" />
    </>,
    { route },
  )
}

describe('ServingsStepper', () => {
  it('começa em 4 porções e anuncia o valor com a unidade', () => {
    renderizar()

    expect(screen.getByRole('group', { name: 'Rendimento da Receita' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('4 porções')
  })

  it('volta a URL limpa quando retorna às 4 porções', async () => {
    const { user, router } = renderizar()

    await user.click(screen.getByRole('button', { name: 'Diminuir porções' }))
    expect(router.state.location.search).toBe('?porcoes=3')

    await user.click(screen.getByRole('button', { name: 'Aumentar porções' }))
    expect(router.state.location.search).toBe('')
  })

  it('desabilita os botões nos limites de 1 e 20', () => {
    renderizar('/receita/1?porcoes=1')
    expect(screen.getByRole('button', { name: 'Diminuir porções' })).toBeDisabled()
  })

  it('não passa de 20 porções, mesmo com um valor maior na URL', () => {
    renderizar('/receita/1?porcoes=50')

    expect(screen.getByRole('status')).toHaveTextContent('20 porções')
    expect(screen.getByRole('button', { name: 'Aumentar porções' })).toBeDisabled()
  })
})
