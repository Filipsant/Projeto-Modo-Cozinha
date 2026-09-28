import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMeasureSystemStore } from '@/features/measure-system'
import { useTimersStore } from '@/features/step-timer'
import { API_BASE_URL } from '@/shared/config'
import { renderWithProviders, server } from '@/shared/testing'
import { useNoticeStore } from '@/shared/ui'
import { CookingModePage } from './CookingModePage'

function cozinhar(query = '', id = '52772') {
  return renderWithProviders(<CookingModePage />, {
    route: `/receita/${id}/cozinhar${query}`,
    path: '/receita/:id/cozinhar',
  })
}

beforeEach(() => {
  useMeasureSystemStore.setState({ system: 'metric' })
  useTimersStore.setState({ timers: {}, ringing: [] })
  useNoticeStore.setState({ notice: null })
})

describe('CookingModePage', () => {
  it('começa no passo 1, com o progresso da receita', async () => {
    cozinhar()

    // Enquanto carrega o título já aparece; o passo só depois que a receita chega
    expect(await screen.findByRole('heading', { level: 2, name: 'Passo 1' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Modo Cozinha Ativo' }),
    ).toBeInTheDocument()
    expect(screen.getByText('17% pronto')).toBeInTheDocument()
    // O passo aparece traduzido, em português
    expect(await screen.findByText(/Pré-aqueça o forno a 350° F/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('avança pelo botão e pelas setas do teclado, guardando o passo na URL', async () => {
    const { user, router } = cozinhar()
    await screen.findByRole('heading', { level: 2, name: 'Passo 1' })

    await user.click(screen.getByRole('button', { name: /próximo/i }))
    expect(screen.getByRole('heading', { level: 2, name: 'Passo 2' })).toBeInTheDocument()
    expect(router.state.location.search).toBe('?passo=2')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { level: 2, name: 'Passo 3' })).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('heading', { level: 2, name: 'Passo 2' })).toBeInTheDocument()
  })

  it('mostra os ingredientes do passo com as porções escolhidas no detalhe', async () => {
    cozinhar('?passo=2&porcoes=8')

    const ingredientes = await screen.findByRole('list')

    // 8 de 4 porções: 3/4 cup × 2 = 360 ml
    expect(within(ingredientes).getByText('Molho de soja')).toBeInTheDocument()
    expect(within(ingredientes).getByText('360 ml')).toBeInTheDocument()
    // No texto traduzido do passo, o ingrediente aparece destacado em português
    expect(await screen.findByText('molho de soja', { selector: 'strong' })).toBeInTheDocument()
  })

  it('mostra o timer só nos passos que citam tempo', async () => {
    cozinhar('?passo=4')

    expect(await screen.findByRole('timer')).toHaveTextContent('35:00')
  })

  it('o voltar leva à receita com as mesmas porções', async () => {
    cozinhar('?passo=2&porcoes=6')

    expect(await screen.findByRole('link', { name: /voltar para a receita/i })).toHaveAttribute(
      'href',
      '/receita/52772?porcoes=6',
    )
  })

  it('ao concluir volta para o início e avisa com o toast', async () => {
    const { user, router } = cozinhar('?passo=6')

    await user.click(await screen.findByRole('button', { name: /concluir/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(useNoticeStore.getState().notice).toMatchObject({
      tone: 'success',
      title: 'Concluído!',
      message: 'Você terminou Teriyaki Chicken Casserole. Bom apetite!',
    })
  })

  it('a seta do teclado não conclui a receita sozinha', async () => {
    const { user, router } = cozinhar('?passo=6')
    await screen.findByRole('heading', { level: 2, name: 'Passo 6' })

    await user.keyboard('{ArrowRight}')

    expect(router.state.location.pathname).toBe('/receita/52772/cozinhar')
    expect(screen.getByRole('heading', { level: 2, name: 'Passo 6' })).toBeInTheDocument()
  })

  it('avisa quando a receita não existe', async () => {
    cozinhar('', '999')
    expect(await screen.findByText('Receita não encontrada')).toBeInTheDocument()
  })

  it('mostra erro com botão de tentar de novo', async () => {
    server.use(
      http.get(`${API_BASE_URL}/lookup.php`, () => new HttpResponse(null, { status: 500 })),
    )
    cozinhar()

    expect(await screen.findByRole('alert')).toHaveTextContent('Não deu para abrir a receita')
  })
})
