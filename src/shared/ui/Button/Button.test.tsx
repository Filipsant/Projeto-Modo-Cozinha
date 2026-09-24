import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('não dispara onClick quando está desabilitado', async () => {
    const user = userEvent.setup()
    const aoClicar = vi.fn()
    render(
      <Button disabled onClick={aoClicar}>
        Iniciar receita
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Iniciar receita' }))

    expect(aoClicar).not.toHaveBeenCalled()
  })

  it('avisa o leitor de tela enquanto carrega', () => {
    render(<Button loading>Salvando</Button>)

    expect(screen.getByRole('button', { name: 'Salvando' })).toHaveAttribute('aria-busy', 'true')
  })
})
