import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_BASE_URL } from '@/shared/config'
import { HttpError } from '@/shared/lib'
import { server } from '@/shared/testing'
import { mealdbClient } from './mealdbClient'

describe('mealdbClient', () => {
  it('busca receitas por nome', async () => {
    const receitas = await mealdbClient.search('chicken')

    expect(receitas).toHaveLength(25)
    expect(receitas[0].name).toBeTruthy()
    expect(receitas[0].ingredients.length).toBeGreaterThan(0)
  })

  it('devolve lista vazia quando a API responde meals: null', async () => {
    const receitas = await mealdbClient.search('zzzzzz')

    expect(receitas).toEqual([])
  })

  it('traz uma receita pelo id', async () => {
    const receita = await mealdbClient.getById('52772')

    expect(receita?.name).toBe('Teriyaki Chicken Casserole')
  })

  it('devolve null quando o id não existe', async () => {
    const receita = await mealdbClient.getById('000')

    expect(receita).toBeNull()
  })

  it('lança HttpError quando a API falha', async () => {
    server.use(
      http.get(`${API_BASE_URL}/search.php`, () => new HttpResponse(null, { status: 500 })),
    )

    await expect(mealdbClient.search('chicken')).rejects.toBeInstanceOf(HttpError)
  })

  it('avisa quando o formato da resposta muda', async () => {
    server.use(http.get(`${API_BASE_URL}/search.php`, () => HttpResponse.json({ receitas: [] })))

    await expect(mealdbClient.search('chicken')).rejects.toThrow()
  })
})
