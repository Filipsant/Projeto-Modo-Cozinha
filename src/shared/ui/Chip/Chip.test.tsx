import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Chip } from './Chip'

function ChipControlado() {
  const [selecionado, setSelecionado] = useState(false)

  return (
    <Chip selected={selecionado} onClick={() => setSelecionado(!selecionado)}>
      Massas
    </Chip>
  )
}

describe('Chip', () => {
  it('alterna aria-pressed ao clicar', async () => {
    const user = userEvent.setup()
    render(<ChipControlado />)
    const chip = screen.getByRole('button', { name: 'Massas' })

    expect(chip).toHaveAttribute('aria-pressed', 'false')
    await user.click(chip)

    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })
})
