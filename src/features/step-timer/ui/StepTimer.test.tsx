import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimersStore } from '../model/timersStore'
import { StepTimer } from './StepTimer'
import { TimerAlarm } from './TimerAlarm'

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  useTimersStore.setState({ timers: {}, ringing: [] })
})

afterEach(() => {
  vi.useRealTimers()
})

function preparar() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  const irParaPasso = vi.fn()

  render(
    <>
      <StepTimer recipeId="52772" step={4} minutes={5} />
      <TimerAlarm onGoToStep={irParaPasso} />
    </>,
  )

  return { user, irParaPasso }
}

describe('StepTimer', () => {
  it('começa parado com o tempo que o passo cita', () => {
    preparar()

    expect(screen.getByRole('timer')).toHaveTextContent('05:00')
    expect(screen.getByText('Pronto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reiniciar timer' })).toBeDisabled()
  })

  it('conta, pausa e reinicia', async () => {
    const { user } = preparar()

    await user.click(screen.getByRole('button', { name: 'Iniciar timer' }))
    act(() => vi.advanceTimersByTime(60_000))

    expect(screen.getByRole('timer')).toHaveTextContent('04:00')
    expect(screen.getByText('Contando')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pausar timer' }))
    act(() => vi.advanceTimersByTime(60_000))

    expect(screen.getByRole('timer')).toHaveTextContent('04:00')
    expect(screen.getByText('Pausado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reiniciar timer' }))
    expect(screen.getByRole('timer')).toHaveTextContent('05:00')
  })

  it('avisa quando o tempo acaba e leva ao passo do timer', async () => {
    const { user, irParaPasso } = preparar()

    await user.click(screen.getByRole('button', { name: 'Iniciar timer' }))
    act(() => vi.advanceTimersByTime(5 * 60_000 + 1_000))

    expect(screen.getByText('Tempo esgotado')).toBeInTheDocument()
    expect(screen.getByText('O timer do passo 4 terminou.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver passo' }))

    expect(irParaPasso).toHaveBeenCalledWith(4)
    expect(screen.queryByText('O timer do passo 4 terminou.')).not.toBeInTheDocument()
  })
})
