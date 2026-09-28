import { describe, expect, it } from 'vitest'
import { splitSteps } from './splitSteps'

describe('splitSteps', () => {
  it('divide por quebra de linha', () => {
    const passos = splitSteps('Preheat the oven.\r\nMix the flour.\n\nBake for 20 minutes.')

    expect(passos).toEqual(['Preheat the oven.', 'Mix the flour.', 'Bake for 20 minutes.'])
  })

  it('remove rótulos como STEP 1', () => {
    const passos = splitSteps('STEP 1\nChop the onion.\nSTEP 2: Fry the onion.')

    expect(passos).toEqual(['Chop the onion.', 'Fry the onion.'])
  })

  it('tira os passos sem nada escrito: números soltos, caixinhas e espaços invisíveis', () => {
    // Formatos reais da API: "1\r\nPrepare the Figs" e o "▢" entre os passos
    const passos = splitSteps('1\r\nCut the figs.\r\n▢\r\n2.\r\nAdd the water.\r\n\u200B\r\n3')

    expect(passos).toEqual(['Cut the figs.', 'Add the water.'])
  })

  it('tira a numeração e os marcadores do começo do passo, que a tela já numera', () => {
    const passos = splitSteps(
      '1. Prepare the dough\n13) Add the bay leaf.\n5.\tShare!\n▢ Stir well.',
    )

    expect(passos).toEqual(['Prepare the dough', 'Add the bay leaf.', 'Share!', 'Stir well.'])
  })

  it('não confunde quantidade com numeração', () => {
    expect(splitSteps('2.5 cups of milk.\n2 eggs, beaten.')).toEqual([
      '2.5 cups of milk.',
      '2 eggs, beaten.',
    ])
  })

  it('tira linhas que só anunciam os passos', () => {
    expect(splitSteps('Instructions:\nBoil the rice.\nMethod\nServe.')).toEqual([
      'Boil the rice.',
      'Serve.',
    ])
  })

  it('divide por frase quando vem tudo num bloco só', () => {
    const passos = splitSteps('Chop the onion. Fry it in oil. Serve hot.')

    expect(passos).toEqual(['Chop the onion.', 'Fry it in oil.', 'Serve hot.'])
  })

  it('devolve lista vazia para texto em branco', () => {
    expect(splitSteps('   ')).toEqual([])
    expect(splitSteps('▢')).toEqual([])
  })
})
