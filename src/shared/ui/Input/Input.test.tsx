import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('mostra o botão de limpar só quando há texto', () => {
    const { rerender } = render(
      <Input label="Buscar receita" value="" onClear={vi.fn()} readOnly />,
    )

    expect(screen.queryByRole('button', { name: 'Limpar buscar receita' })).not.toBeInTheDocument()

    rerender(<Input label="Buscar receita" value="frango" onClear={vi.fn()} readOnly />)

    expect(screen.getByRole('button', { name: 'Limpar buscar receita' })).toBeInTheDocument()
  })

  it('chama onClear ao clicar no botão de limpar', async () => {
    const user = userEvent.setup()
    const aoLimpar = vi.fn()
    render(<Input label="Buscar receita" value="frango" onClear={aoLimpar} readOnly />)

    await user.click(screen.getByRole('button', { name: 'Limpar buscar receita' }))

    expect(aoLimpar).toHaveBeenCalledOnce()
  })
})
