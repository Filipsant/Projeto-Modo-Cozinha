import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConnectionStatus, OfflineBanner } from './ConnectionStatus'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ConnectionStatus', () => {
  it('mostra Online e, sem internet, Offline com o aviso do que continua funcionando', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    render(
      <>
        <ConnectionStatus />
        <OfflineBanner />
      </>,
    )

    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    online.mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Sem internet. As receitas que você já abriu, os favoritos e a lista de compras continuam funcionando.',
    )
  })
})
