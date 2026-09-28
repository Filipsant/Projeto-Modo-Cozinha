import { describe, expect, it } from 'vitest'
import { CLICK_WINDOW_MS, DUPLICATE_MS, addOpen, countClicks, pruneOpens } from './clicks'

const AGORA = 1_000_000_000_000

describe('cliques', () => {
  it('soma uma abertura por vez', () => {
    let aberturas = addOpen({}, '52772', AGORA)
    aberturas = addOpen(aberturas, '52772', AGORA + 60_000)
    aberturas = addOpen(aberturas, '52771', AGORA + 60_000)

    expect(countClicks(aberturas)).toEqual({ '52772': 2, '52771': 1 })
  })

  it('não conta duas vezes a mesma abertura, como a do StrictMode', () => {
    const aberturas = addOpen(addOpen({}, '52772', AGORA), '52772', AGORA + DUPLICATE_MS - 1)

    expect(countClicks(aberturas)).toEqual({ '52772': 1 })
  })

  it('esquece o que passou de 7 dias', () => {
    const aberturas = {
      velha: [AGORA - CLICK_WINDOW_MS - 1],
      mista: [AGORA - CLICK_WINDOW_MS, AGORA],
    }

    expect(pruneOpens(aberturas, AGORA)).toEqual({ mista: [AGORA] })
  })
})
