import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from './Combobox'

const opcoes = [
  { value: 'Brazil', label: 'Brasil', count: 11 },
  { value: 'France', label: 'França', count: 28 },
  { value: 'Japan', label: 'Japão', count: 9 },
]

function ComboboxControlado({ onChange = vi.fn() }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <Combobox
      label="Origem culinária"
      placeholder="Todas as origens"
      options={opcoes}
      value={value}
      onChange={(novo) => {
        setValue(novo)
        onChange(novo)
      }}
    />
  )
}

describe('Combobox', () => {
  it('filtra as opções conforme o usuário digita', async () => {
    const user = userEvent.setup()
    render(<ComboboxControlado />)

    await user.type(screen.getByRole('combobox'), 'jap')

    expect(screen.getByRole('option', { name: /Japão/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Brasil/ })).not.toBeInTheDocument()
  })

  it('escolhe pelo teclado com setas e Enter', async () => {
    const user = userEvent.setup()
    const aoEscolher = vi.fn()
    render(<ComboboxControlado onChange={aoEscolher} />)

    await user.click(screen.getByRole('combobox'))
    // A lista abre já com a primeira opção em foco, então uma seta chega na segunda
    await user.keyboard('{ArrowDown}{Enter}')

    expect(aoEscolher).toHaveBeenCalledWith('France')
    expect(screen.getByRole('combobox')).toHaveValue('França')
  })

  it('anuncia a opção em foco para o leitor de tela', async () => {
    const user = userEvent.setup()
    render(<ComboboxControlado />)

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant')
  })

  it('Esc fecha a lista sem escolher', async () => {
    const user = userEvent.setup()
    const aoEscolher = vi.fn()
    render(<ComboboxControlado onChange={aoEscolher} />)

    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(aoEscolher).not.toHaveBeenCalled()
  })

  it('abre e fecha a lista pela seta', async () => {
    const user = userEvent.setup()
    render(<ComboboxControlado />)
    const seta = screen.getByRole('button', { name: 'Origem culinária' })

    await user.click(seta)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveFocus()

    await user.click(seta)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('mostra aviso quando a busca não casa com nada', async () => {
    const user = userEvent.setup()
    render(<ComboboxControlado />)

    await user.type(screen.getByRole('combobox'), 'xyz')

    expect(screen.getByText('Nada encontrado')).toBeInTheDocument()
  })
})
