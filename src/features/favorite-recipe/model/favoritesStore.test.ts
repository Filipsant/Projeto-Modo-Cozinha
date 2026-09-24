import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from './favoritesStore'

const receita = { id: '52772', name: 'Teriyaki Chicken', thumbnail: 'foto.jpg' }

beforeEach(() => {
  useFavoritesStore.setState({ items: [] })
  localStorage.clear()
})

describe('favoritesStore', () => {
  it('favorita e desfavorita a mesma receita', () => {
    useFavoritesStore.getState().toggle(receita)
    expect(useFavoritesStore.getState().items).toHaveLength(1)

    useFavoritesStore.getState().toggle(receita)
    expect(useFavoritesStore.getState().items).toEqual([])
  })

  it('guarda a data para permitir ordenar por mais recentes', () => {
    useFavoritesStore.getState().toggle(receita)

    expect(useFavoritesStore.getState().items[0].savedAt).toBeGreaterThan(0)
  })

  it('a mais recente entra no topo da lista', () => {
    useFavoritesStore.getState().toggle(receita)
    useFavoritesStore.getState().toggle({ ...receita, id: '2', name: 'Outra' })

    expect(useFavoritesStore.getState().items.map((item) => item.id)).toEqual(['2', '52772'])
  })

  it('persiste no localStorage com nome e versão', () => {
    useFavoritesStore.getState().toggle(receita)

    const salvo = localStorage.getItem('modo-cozinha:favorites')
    expect(salvo).toBeTruthy()
    expect(JSON.parse(salvo!)).toMatchObject({ version: 1 })
  })
})
