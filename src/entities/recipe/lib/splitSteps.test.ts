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

  it('divide por frase quando vem tudo num bloco só', () => {
    const passos = splitSteps('Chop the onion. Fry it in oil. Serve hot.')

    expect(passos).toEqual(['Chop the onion.', 'Fry it in oil.', 'Serve hot.'])
  })

  it('devolve lista vazia para texto em branco', () => {
    expect(splitSteps('   ')).toEqual([])
  })
})
