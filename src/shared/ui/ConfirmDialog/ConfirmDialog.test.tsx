import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

function Exemplo({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Esvaziar lista
      </button>
      <ConfirmDialog
        open={open}
        title="Limpar lista de compras?"
        description="Esta ação removerá 14 ingredientes e não poderá ser desfeita."
        confirmLabel="Limpar tudo"
        cancelLabel="Cancelar"
        onConfirm={() => {
          onConfirm()
          setOpen(false)
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

describe('ConfirmDialog', () => {
  it('abre com o foco no Cancelar e o texto do aviso', async () => {
    const user = userEvent.setup()
    render(<Exemplo onConfirm={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Esvaziar lista' }))

    const dialogo = screen.getByRole('alertdialog', { name: 'Limpar lista de compras?' })
    expect(dialogo).toHaveAccessibleDescription(
      'Esta ação removerá 14 ingredientes e não poderá ser desfeita.',
    )
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
  })

  it('o Tab não sai do diálogo', async () => {
    const user = userEvent.setup()
    render(<Exemplo onConfirm={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Esvaziar lista' }))

    await user.tab()
    expect(screen.getByRole('button', { name: 'Limpar tudo' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()
  })

  it('Esc fecha sem confirmar e devolve o foco a quem abriu', async () => {
    const user = userEvent.setup()
    const confirmar = vi.fn()
    render(<Exemplo onConfirm={confirmar} />)
    const abrir = screen.getByRole('button', { name: 'Esvaziar lista' })

    await user.click(abrir)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(confirmar).not.toHaveBeenCalled()
    expect(abrir).toHaveFocus()
  })

  it('confirma pelo botão vermelho', async () => {
    const user = userEvent.setup()
    const confirmar = vi.fn()
    render(<Exemplo onConfirm={confirmar} />)

    await user.click(screen.getByRole('button', { name: 'Esvaziar lista' }))
    await user.click(screen.getByRole('button', { name: 'Limpar tudo' }))

    expect(confirmar).toHaveBeenCalledOnce()
  })
})
