import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('só entrega o valor depois do tempo combinado', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ termo }) => useDebounce(termo, 400), {
      initialProps: { termo: 'fra' },
    })

    rerender({ termo: 'frango' })
    expect(result.current).toBe('fra')

    act(() => vi.advanceTimersByTime(399))
    expect(result.current).toBe('fra')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('frango')
  })

  it('digitar de novo reinicia a contagem', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ termo }) => useDebounce(termo, 400), {
      initialProps: { termo: '' },
    })

    rerender({ termo: 'f' })
    act(() => vi.advanceTimersByTime(300))
    rerender({ termo: 'fr' })
    act(() => vi.advanceTimersByTime(300))

    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('fr')
  })
})
