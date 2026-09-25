import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMeasureSystemStore } from '@/features/measure-system'
import { useShoppingListStore } from '@/features/shopping-list'
import { useTimersStore } from '@/features/step-timer'
import { API_BASE_URL } from '@/shared/config'
import { renderWithProviders, server } from '@/shared/testing'
import { RecipeDetailsPage } from './RecipeDetailsPage'

beforeEach(() => {
  useMeasureSystemStore.setState({ system: 'metric' })
  useShoppingListStore.setState({ recipes: [], items: [] })
  useTimersStore.setState({ timers: {}, ringing: [] })
})

function abrirReceita(id = '52772') {
  return renderWithProviders(<RecipeDetailsPage />, {
    route: `/receita/${id}`,
    path: '/receita/:id',
  })
}

describe('RecipeDetailsPage', () => {
  it('mostra a receita com título, trilha e estatísticas', async () => {
    abrirReceita()

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Teriyaki Chicken Casserole' }),
    ).toBeInTheDocument()

    const trilha = screen.getByRole('navigation', { name: 'Você está em' })
    expect(within(trilha).getByRole('link', { name: 'Japão' })).toHaveAttribute(
      'href',
      '/?origem=Japan',
    )

    // Três passos falam de forno e três de panela no fogo
    expect(screen.getByText('Forno + Fogão')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /começar a cozinhar/i })).toHaveAttribute(
      'href',
      '/receita/52772/cozinhar',
    )
  })

  it('lista os ingredientes traduzidos, com a medida em ml e g', async () => {
    abrirReceita()

    // Métricas é o padrão: "3/4 cup" vira 180 ml
    const ingrediente = await screen.findByRole('checkbox', { name: 'Molho de soja 180 ml' })

    expect(ingrediente).not.toBeChecked()
    expect(screen.getByText('0 de 9 separados')).toBeInTheDocument()
  })

  it('recalcula as medidas pelas porções e guarda o valor na URL', async () => {
    const { user, router } = abrirReceita()
    const aumentar = await screen.findByRole('button', { name: 'Aumentar porções' })

    await user.click(aumentar)
    await user.click(aumentar)

    // 6 de 4 porções: 3/4 cup × 1,5 = 270 ml
    expect(screen.getByRole('checkbox', { name: 'Molho de soja 270 ml' })).toBeInTheDocument()
    expect(router.state.location.search).toBe('?porcoes=6')
    expect(screen.getByRole('link', { name: /começar a cozinhar/i })).toHaveAttribute(
      'href',
      '/receita/52772/cozinhar?porcoes=6',
    )
  })

  it('abre com as porções da URL e troca para as unidades originais', async () => {
    const { user } = renderWithProviders(<RecipeDetailsPage />, {
      route: '/receita/52772?porcoes=8',
      path: '/receita/:id',
    })

    await screen.findByRole('checkbox', { name: 'Molho de soja 360 ml' })
    await user.click(screen.getByRole('radio', { name: 'Originais (xíc/oz)' }))

    expect(screen.getByRole('checkbox', { name: 'Molho de soja 1 ½ xícara' })).toBeInTheDocument()
    expect(useMeasureSystemStore.getState().system).toBe('original')
  })

  it('mostra cada passo com o tempo e os ingredientes que ele cita', async () => {
    abrirReceita()

    const preparo = await screen.findByRole('region', { name: 'Modo de Preparo' })
    const passos = within(preparo).getAllByRole('listitem')

    expect(within(preparo).getByText('6 etapas sequenciais')).toBeInTheDocument()
    expect(passos).toHaveLength(6)
    expect(passos[3]).toHaveTextContent('Passo 4')
    expect(within(passos[3]).getByText('35 min')).toBeInTheDocument()
    expect(within(passos[1]).getByText('Molho de soja')).toBeInTheDocument()
  })

  it('adiciona à lista de compras e atualiza quando as porções mudam', async () => {
    const { user } = abrirReceita()
    // Água não entra na lista: são 8 dos 9 ingredientes
    const adicionar = await screen.findByRole('button', {
      name: 'Adicionar à Lista de Compras 8 itens',
    })

    await user.click(adicionar)

    expect(useShoppingListStore.getState().recipes).toMatchObject([{ id: '52772', servings: 4 }])
    expect(screen.getByRole('button', { name: /ver na lista de compras/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Aumentar porções' }))

    expect(
      screen.getByRole('button', { name: /atualizar lista para 5 porções/i }),
    ).toBeInTheDocument()
  })

  it('oferece o cronômetro rápido do passo mais demorado', async () => {
    const { user } = abrirReceita()
    const cronometro = await screen.findByRole('heading', {
      name: 'Cronômetro de Cozimento Rápido',
    })
    const cartao = cronometro.closest('div')!.parentElement!

    expect(within(cartao).getByText('Dispare 35 min do passo 4')).toBeInTheDocument()
    expect(within(cartao).getByRole('timer')).toHaveTextContent('35:00')

    await user.click(within(cartao).getByRole('button', { name: /iniciar/i }))

    expect(within(cartao).getByRole('button', { name: /pausar/i })).toBeInTheDocument()
  })

  it('avisa quando a receita não existe', async () => {
    abrirReceita('999')

    expect(await screen.findByText('Receita não encontrada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar para as receitas/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('mostra erro com botão de tentar de novo quando a API falha', async () => {
    server.use(
      http.get(`${API_BASE_URL}/lookup.php`, () => new HttpResponse(null, { status: 500 })),
    )
    abrirReceita()

    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu para abrir a receita')
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeInTheDocument()
  })
})
