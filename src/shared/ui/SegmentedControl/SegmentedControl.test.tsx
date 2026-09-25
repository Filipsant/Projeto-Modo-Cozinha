import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

function Exemplo() {
  const [value, setValue] = useState<'metric' | 'original'>('metric')

  return (
    <SegmentedControl
      label="Sistema de Medidas"
      options={[
        { value: 'metric', label: 'Métricas' },
        { value: 'original', label: 'Originais' },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}

describe('SegmentedControl', () => {
  it('é um grupo de rádios com o nome visível', () => {
    render(<Exemplo />)

    expect(screen.getByRole('radiogroup', { name: 'Sistema de Medidas' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Métricas' })).toBeChecked()
  })

  it('troca de opção pelo clique e pelas setas do teclado', async () => {
    const user = userEvent.setup()
    render(<Exemplo />)

    await user.click(screen.getByText('Originais'))
    expect(screen.getByRole('radio', { name: 'Originais' })).toBeChecked()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Métricas' })).toBeChecked()
  })
})
