import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePwaStore } from '../model/pwaStore'
import { OfflineReadyBadge } from './OfflineReadyBadge'
import { UpdatePrompt } from './UpdatePrompt'

beforeEach(() => {
  usePwaStore.setState({ offlineReady: false, applyUpdate: null })
})

describe('UpdatePrompt', () => {
  it('só aparece quando há versão nova, e atualiza no toque', async () => {
    const user = userEvent.setup()
    const atualizar = vi.fn()
    render(<UpdatePrompt />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => usePwaStore.getState().setUpdateAvailable(atualizar))

    expect(screen.getByRole('status')).toHaveTextContent('Nova versão do Modo Cozinha disponível.')

    await user.click(screen.getByRole('button', { name: 'Atualizar' }))
    expect(atualizar).toHaveBeenCalledOnce()
  })

  it('pode ser dispensada para atualizar depois', async () => {
    const user = userEvent.setup()
    usePwaStore.getState().setUpdateAvailable(vi.fn())
    render(<UpdatePrompt />)

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('OfflineReadyBadge', () => {
  it('só promete cozinhar offline depois que o app foi guardado', () => {
    render(<OfflineReadyBadge />)
    expect(screen.queryByText('Pronto para cozinhar offline')).not.toBeInTheDocument()

    act(() => usePwaStore.getState().setOfflineReady())

    expect(screen.getByText('Pronto para cozinhar offline')).toBeInTheDocument()
  })
})
