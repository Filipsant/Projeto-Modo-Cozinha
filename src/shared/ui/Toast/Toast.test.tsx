import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('anuncia a mensagem como status', () => {
    render(<Toast message="Receita removida dos favoritos" />)

    expect(screen.getByRole('status')).toHaveTextContent('Receita removida dos favoritos')
  })

  it('chama a ação de desfazer ao clicar', async () => {
    const user = userEvent.setup()
    const aoDesfazer = vi.fn()
    render(
      <Toast
        message="Receita removida dos favoritos"
        actionLabel="Desfazer"
        onAction={aoDesfazer}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Desfazer' }))

    expect(aoDesfazer).toHaveBeenCalledOnce()
  })
})
