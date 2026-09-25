import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWakeLock } from './useWakeLock'

function fakeWakeLock() {
  const release = vi.fn().mockResolvedValue(undefined)
  const sentinel = { release, addEventListener: vi.fn() }
  const request = vi.fn().mockResolvedValue(sentinel)

  Object.defineProperty(navigator, 'wakeLock', { value: { request }, configurable: true })

  return { request, release }
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'wakeLock')
})

describe('useWakeLock', () => {
  it('pede para manter a tela acesa e solta ao sair', async () => {
    const { request, release } = fakeWakeLock()
    const { result, unmount } = renderHook(() => useWakeLock())

    await waitFor(() => expect(result.current).toBe(true))
    expect(request).toHaveBeenCalledWith('screen')

    unmount()
    expect(release).toHaveBeenCalled()
  })

  it('pede de novo quando a aba volta a ficar visível', async () => {
    const { request } = fakeWakeLock()
    renderHook(() => useWakeLock())
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
  })

  it('devolve false quando o navegador não tem suporte ou recusa', async () => {
    const { result } = renderHook(() => useWakeLock())
    expect(result.current).toBe(false)

    Object.defineProperty(navigator, 'wakeLock', {
      value: { request: vi.fn().mockRejectedValue(new Error('bateria fraca')) },
      configurable: true,
    })
    const recusado = renderHook(() => useWakeLock())

    await waitFor(() => expect(recusado.result.current).toBe(false))
  })
})
