import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useClicksStore } from '@/features/recipe-clicks'
import { renderWithProviders } from '@/shared/testing'
import { TrendingRecipes } from './TrendingRecipes'

// Nos testes, o catálogo são as 25 receitas da busca por "chicken"
const ESPERA_DO_CATALOGO = { timeout: 3000 }

beforeEach(() => {
  useClicksStore.setState({ opens: {} })
})

function abrir() {
  return renderWithProviders(<TrendingRecipes exploreHref="#receitas" />)
}

describe('TrendingRecipes', () => {
  it('mostra o título, as abas e sugestões enquanto não há cliques', async () => {
    abrir()

    expect(screen.getByRole('heading', { level: 2, name: 'Em alta na bancada' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Mais clicadas' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    // Dez cartões, todos sugestões: ninguém abriu receita ainda
    const sugestoes = await screen.findAllByRole(
      'link',
      { name: /sugestão do catálogo$/ },
      ESPERA_DO_CATALOGO,
    )
    expect(sugestoes).toHaveLength(10)
    expect(sugestoes[0]).toHaveAttribute('href', expect.stringMatching(/^\/receita\/\d+$/))
    expect(screen.getByText('nenhum clique ainda')).toBeInTheDocument()
  })

  it('põe as receitas mais abertas no topo, com a posição e os cliques', async () => {
    const agora = Date.now()
    useClicksStore.setState({
      opens: { '52795': [agora - 60_000, agora], '52772': [agora] },
    })
    abrir()

    const trilho = await screen.findByRole('list', {}, ESPERA_DO_CATALOGO)
    const cartoes = await within(trilho).findAllByRole('link', {}, ESPERA_DO_CATALOGO)

    expect(cartoes[0]).toHaveAccessibleName('1º lugar: Chicken Handi, 2 cliques')
    expect(screen.getByText('3 cliques neste aparelho')).toBeInTheDocument()
  })

  it('troca de aba pelo clique e pelas setas do teclado', async () => {
    const { user } = abrir()
    await screen.findAllByRole('link', { name: /sugestão do catálogo$/ }, ESPERA_DO_CATALOGO)

    await user.click(screen.getByRole('tab', { name: 'Sobremesas' }))
    expect(screen.getByRole('tab', { name: 'Sobremesas' })).toHaveAttribute('aria-selected', 'true')
    // Nenhuma sobremesa entre as receitas de frango dos testes
    expect(screen.queryByRole('link', { name: /sugestão do catálogo$/ })).not.toBeInTheDocument()
    expect(screen.getByText('Nenhuma receita nesta categoria por enquanto.')).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Vegetarianas' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Mais clicadas' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('leva à lista completa pelo "Explorar tudo"', () => {
    abrir()

    expect(screen.getByRole('link', { name: 'Explorar tudo' })).toHaveAttribute('href', '#receitas')
  })
})
