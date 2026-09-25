import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Recipe } from '@/entities/recipe'
import { useMeasureSystemStore } from '@/features/measure-system'
import { useShoppingListStore } from '@/features/shopping-list'
import { renderWithProviders } from '@/shared/testing'
import { ShoppingListPage } from './ShoppingListPage'

function receita(id: string, name: string, ...ingredientes: [string, string][]): Recipe {
  return {
    id,
    name,
    thumbnail: 'foto.jpg',
    instructions: '',
    steps: [],
    ingredients: ingredientes.map(([ingrediente, measure]) => ({ name: ingrediente, measure })),
    tags: [],
    estimatedMinutes: 10,
    difficulty: 'easy',
    methods: [],
  }
}

const bolonhesa = receita(
  '1',
  'Spaghetti Bolognese',
  ['Minced Beef', '400g'],
  ['Spaghetti', '320g'],
  ['Garlic', '2 cloves'],
)
const tikka = receita('2', 'Chicken Tikka Masala', ['Chicken Breast', '300g'], ['Salt', 'To taste'])

beforeEach(() => {
  useShoppingListStore.setState({ recipes: [], items: [] })
  useMeasureSystemStore.setState({ system: 'metric' })
  localStorage.clear()
})

describe('ShoppingListPage', () => {
  it('convida a explorar quando a lista está vazia', () => {
    renderWithProviders(<ShoppingListPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Lista de Compras' })).toBeVisible()
    expect(screen.getByText('Sua lista está vazia')).toBeInTheDocument()
  })

  it('agrupa por receita, com as medidas nas porções escolhidas', () => {
    useShoppingListStore.getState().addRecipe(bolonhesa, 8)
    useShoppingListStore.getState().addRecipe(tikka, 4)
    renderWithProviders(<ShoppingListPage />)

    expect(screen.getByText('5 pendentes')).toBeInTheDocument()
    expect(screen.getByText('0 de 5 itens adquiridos')).toBeInTheDocument()

    const grupo = screen.getByRole('region', { name: 'Spaghetti Bolognese' })
    // 8 de 4 porções: o dobro
    expect(within(grupo).getByRole('checkbox', { name: /800 g Carne moída/ })).toBeInTheDocument()
    expect(within(grupo).getByRole('checkbox', { name: /4 dentes Alho/ })).toBeInTheDocument()
    // Sem número, a nota vai depois do nome
    expect(screen.getByRole('checkbox', { name: /Sal \(a gosto\)/ })).toBeInTheDocument()
  })

  it('marcar um item leva ele para "Itens já comprados" e atualiza o progresso', async () => {
    useShoppingListStore.getState().addRecipe(bolonhesa, 4)
    const { user } = renderWithProviders(<ShoppingListPage />)

    await user.click(screen.getByRole('checkbox', { name: /400 g Carne moída/ }))

    expect(screen.getByText('1 de 3 itens adquiridos')).toBeInTheDocument()
    expect(screen.getByText('33% concluído')).toBeInTheDocument()
    const comprados = screen.getByText('Itens já comprados').closest('details')!
    expect(within(comprados).getByRole('checkbox', { name: /Carne moída/ })).toBeChecked()
  })

  it('agrupa por corredor, com o nome da receita embaixo de cada item', async () => {
    useShoppingListStore.getState().addRecipe(bolonhesa, 4)
    const { user } = renderWithProviders(<ShoppingListPage />)

    await user.click(screen.getByRole('radio', { name: 'Por Corredor' }))

    const acougue = screen.getByRole('region', { name: 'Açougue' })
    expect(screen.getByRole('region', { name: 'Massas e Grãos' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Hortifrúti' })).toBeInTheDocument()
    // Na visão por corredor, a linha de baixo diz de qual receita é o item
    expect(
      within(acougue).getByRole('checkbox', { name: '400 g Carne moída Spaghetti Bolognese' }),
    ).toBeInTheDocument()
  })

  it('esvazia a lista só depois de confirmar', async () => {
    useShoppingListStore.getState().addRecipe(bolonhesa, 4)
    const { user } = renderWithProviders(<ShoppingListPage />)

    await user.click(screen.getByRole('button', { name: 'Mais ações' }))
    await user.click(screen.getByRole('button', { name: 'Esvaziar lista' }))

    const dialogo = screen.getByRole('alertdialog', { name: 'Limpar lista de compras?' })
    expect(dialogo).toHaveAccessibleDescription(
      'Esta ação removerá 3 ingredientes e não poderá ser desfeita.',
    )

    await user.click(within(dialogo).getByRole('button', { name: 'Limpar tudo' }))

    expect(screen.getByText('Sua lista está vazia')).toBeInTheDocument()
  })

  it('compartilha só o que falta comprar, como texto', async () => {
    useShoppingListStore.getState().addRecipe(bolonhesa, 4)
    useShoppingListStore.getState().toggleItem('1:1')
    const { user } = renderWithProviders(<ShoppingListPage />)

    await user.click(screen.getByRole('button', { name: 'Compartilhar' }))

    expect(await screen.findByText('Lista copiada para a área de transferência')).toBeVisible()
    expect(await navigator.clipboard.readText()).toBe(
      [
        'Lista de compras · Modo Cozinha',
        'Spaghetti Bolognese (4 porções)\n• 400 g Carne moída\n• 2 dentes Alho',
      ].join('\n\n'),
    )
  })
})
