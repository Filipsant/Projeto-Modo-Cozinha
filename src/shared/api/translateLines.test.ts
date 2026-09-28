import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { TRANSLATE_URL } from '@/shared/config'
import { server } from '@/shared/testing'
import { translateLines } from './translateLines'

// Um tradutor de mentira: devolve o texto em maiúsculas, no formato do Google
function tradutor(traduzir: (texto: string) => string = (texto) => texto.toUpperCase()) {
  const pedidos: string[] = []

  server.use(
    http.get(TRANSLATE_URL, ({ request }) => {
      const texto = new URL(request.url).searchParams.get('q') ?? ''
      pedidos.push(texto)

      return HttpResponse.json([[[traduzir(texto), texto]], null, 'en'])
    }),
  )

  return pedidos
}

const opcoes = { from: 'en', to: 'pt' }

describe('translateLines', () => {
  it('traduz tudo num pedido só, cada linha no seu lugar', async () => {
    const pedidos = tradutor()

    await expect(translateLines(['chop', 'fry', 'serve'], opcoes)).resolves.toEqual([
      'CHOP',
      'FRY',
      'SERVE',
    ])
    expect(pedidos).toEqual(['chop\nfry\nserve'])
  })

  it('divide receita longa em mais de um pedido', async () => {
    const pedidos = tradutor()
    const passos = ['a'.repeat(3000), 'b'.repeat(3000), 'c'.repeat(10)]

    const traduzidos = await translateLines(passos, opcoes)

    expect(pedidos).toHaveLength(2)
    expect(traduzidos).toEqual(passos.map((passo) => passo.toUpperCase()))
  })

  it('traduz linha a linha quando o tradutor junta as linhas', async () => {
    // Juntar tudo numa linha só desalinharia os passos
    tradutor((texto) => texto.toUpperCase().replaceAll('\n', ' '))

    await expect(translateLines(['chop', 'fry'], opcoes)).resolves.toEqual(['CHOP', 'FRY'])
  })

  it('não chama o tradutor sem linhas', async () => {
    const pedidos = tradutor()

    await expect(translateLines([], opcoes)).resolves.toEqual([])
    expect(pedidos).toEqual([])
  })

  it('falha quando o tradutor falha, para a tela mostrar o original', async () => {
    server.use(http.get(TRANSLATE_URL, () => new HttpResponse(null, { status: 429 })))

    await expect(translateLines(['chop'], opcoes)).rejects.toThrow(/429/)
  })
})
