import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useOnlineStatus } from './useOnlineStatus'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useOnlineStatus', () => {
  it('acompanha a conexão caindo e voltando', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)

    online.mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)

    online.mockReturnValue(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })
})
