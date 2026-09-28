import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NOTICE_MS, NoticeToast } from './NoticeToast'
import { showNotice, useNoticeStore } from './noticeStore'

const concluido = {
  tone: 'success',
  title: 'Concluído!',
  message: 'Você terminou Teriyaki Chicken Casserole. Bom apetite!',
} as const

beforeEach(() => {
  useNoticeStore.setState({ notice: null })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('NoticeToast', () => {
  it('mostra título e mensagem do aviso pedido de qualquer lugar', () => {
    render(<NoticeToast />)

    act(() => showNotice(concluido))

    expect(screen.getByRole('status')).toHaveTextContent('Concluído!')
    expect(screen.getByRole('status')).toHaveTextContent('Você terminou Teriyaki Chicken Casserole')
  })

  it('some sozinho depois de alguns segundos', () => {
    vi.useFakeTimers()
    render(<NoticeToast />)
    act(() => showNotice(concluido))

    act(() => vi.advanceTimersByTime(NOTICE_MS))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('fecha pelo X', async () => {
    const user = userEvent.setup()
    render(<NoticeToast />)
    act(() => showNotice(concluido))

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
