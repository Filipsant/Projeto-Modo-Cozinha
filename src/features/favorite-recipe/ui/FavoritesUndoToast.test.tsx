import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { useFavoritesStore } from '../model/favoritesStore'
import { FavoritesUndoToast, UNDO_MS } from './FavoritesUndoToast'

const omelete: Recipe = {
  id: '1',
  name: 'Omelete',
  thumbnail: 'foto.jpg',
  instructions: '',
  steps: [],
  ingredients: [],
  tags: [],
  estimatedMinutes: 10,
  difficulty: 'easy',
  methods: [],
}

beforeEach(() => {
  useFavoritesStore.setState({ items: [], lastRemoved: null })
  useFavoritesStore.getState().toggle(omelete)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('FavoritesUndoToast', () => {
  it('avisa a remoção e devolve a receita com "Desfazer"', async () => {
    const user = userEvent.setup()
    render(<FavoritesUndoToast />)

    act(() => useFavoritesStore.getState().remove('1'))

    expect(screen.getByRole('status')).toHaveTextContent('Receita removida dos favoritos.')

    await user.click(screen.getByRole('button', { name: 'Desfazer' }))

    expect(useFavoritesStore.getState().items.map((item) => item.id)).toEqual(['1'])
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('some sozinho depois de 5 segundos', () => {
    vi.useFakeTimers()
    render(<FavoritesUndoToast />)

    act(() => useFavoritesStore.getState().remove('1'))
    act(() => vi.advanceTimersByTime(UNDO_MS - 1))
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(useFavoritesStore.getState().items).toEqual([])
  })
})
