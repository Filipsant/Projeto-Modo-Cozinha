import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/testing'
import { ShareButton } from './ShareButton'

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share')
})

describe('ShareButton', () => {
  it('copia o link e avisa quando o navegador não tem menu de compartilhar', async () => {
    // O userEvent troca a área de transferência por uma de mentira, que dá para ler
    const { user } = renderWithProviders(<ShareButton title="Feijoada" />, {
      route: '/receita/1',
    })

    await user.click(screen.getByRole('button', { name: 'Compartilhar receita' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Link da receita copiado')
    expect(await navigator.clipboard.readText()).toBe(window.location.href)
  })

  it('usa o menu de compartilhar do sistema quando ele existe', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    const { user } = renderWithProviders(<ShareButton title="Feijoada" />)

    await user.click(screen.getByRole('button', { name: 'Compartilhar receita' }))

    expect(share).toHaveBeenCalledWith({ title: 'Feijoada', url: window.location.href })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('não mostra erro quando a pessoa fecha o menu sem compartilhar', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError'))
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    const { user } = renderWithProviders(<ShareButton title="Feijoada" />)

    await user.click(screen.getByRole('button', { name: 'Compartilhar receita' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
