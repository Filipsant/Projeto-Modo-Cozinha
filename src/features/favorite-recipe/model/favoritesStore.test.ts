import { beforeEach, describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { useFavoritesStore } from './favoritesStore'

function receita(id: string, name = 'Teriyaki Chicken'): Recipe {
  return {
    id,
    name,
    thumbnail: 'foto.jpg',
    instructions: 'Cook.',
    steps: ['Cook.'],
    ingredients: [{ name: 'Chicken', measure: '1' }],
    tags: [],
    estimatedMinutes: 20,
    difficulty: 'easy',
    methods: ['stovetop'],
  }
}

const store = () => useFavoritesStore.getState()
const ids = () => store().items.map((item) => item.id)

beforeEach(() => {
  useFavoritesStore.setState({ items: [], lastRemoved: null })
  localStorage.clear()
})

describe('favoritesStore', () => {
  it('favorita e desfavorita a mesma receita', () => {
    store().toggle(receita('1'))
    expect(store().items).toHaveLength(1)

    store().toggle(receita('1'))
    expect(store().items).toEqual([])
  })

  it('guarda a receita inteira e a data, para a página funcionar sem buscar de novo', () => {
    store().toggle(receita('1'))

    expect(store().items[0]).toMatchObject({ estimatedMinutes: 20, difficulty: 'easy' })
    expect(store().items[0].savedAt).toBeGreaterThan(0)
  })

  it('a mais recente entra no topo da lista', () => {
    store().toggle(receita('1'))
    store().toggle(receita('2'))

    expect(ids()).toEqual(['2', '1'])
  })

  it('desfaz a remoção devolvendo a receita ao mesmo lugar', () => {
    store().toggle(receita('1'))
    store().toggle(receita('2'))
    store().toggle(receita('3'))

    store().remove('2')
    expect(ids()).toEqual(['3', '1'])
    expect(store().lastRemoved?.item.id).toBe('2')

    store().undoRemove()
    expect(ids()).toEqual(['3', '2', '1'])
    expect(store().lastRemoved).toBeNull()
  })

  it('esquece o "Desfazer" quando a mesma receita é salva de novo', () => {
    store().toggle(receita('1'))
    store().remove('1')
    store().toggle(receita('1'))

    expect(store().lastRemoved).toBeNull()
  })

  it('persiste só a lista, com nome e versão', () => {
    store().toggle(receita('1'))
    store().remove('1')
    store().toggle(receita('2'))

    const salvo = JSON.parse(localStorage.getItem('modo-cozinha:favorites')!)
    expect(salvo).toMatchObject({ version: 2 })
    expect(Object.keys(salvo.state)).toEqual(['items'])
  })

  it('completa uma favorita parcial sem mudar a data em que foi salva', () => {
    useFavoritesStore.setState({
      items: [{ ...receita('1'), steps: [], estimatedMinutes: 0, savedAt: 42, partial: true }],
    })

    store().refresh(receita('1'))

    expect(store().items[0]).toMatchObject({ savedAt: 42, estimatedMinutes: 20 })
    expect(store().items[0].partial).toBeUndefined()
  })

  it('migra a versão 1, que guardava só o resumo, marcando como parcial', async () => {
    localStorage.setItem(
      'modo-cozinha:favorites',
      JSON.stringify({
        version: 1,
        state: { items: [{ id: '9', name: 'Antiga', thumbnail: 'f.jpg', savedAt: 7 }] },
      }),
    )

    await useFavoritesStore.persist.rehydrate()

    expect(store().items[0]).toMatchObject({
      id: '9',
      name: 'Antiga',
      savedAt: 7,
      partial: true,
      steps: [],
    })
  })
})
