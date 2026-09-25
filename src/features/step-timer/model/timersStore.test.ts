import { beforeEach, describe, expect, it } from 'vitest'
import { remainingMs, timerStatus } from '../lib/timer'
import { timerKey, useTimersStore } from './timersStore'

const MINUTO = 60_000
const store = () => useTimersStore.getState()
const chave = timerKey('52772', 3)

beforeEach(() => {
  useTimersStore.setState({ timers: {}, ringing: [] })
})

describe('timersStore', () => {
  it('o mesmo botão inicia e pausa', () => {
    store().toggle(chave, 5 * MINUTO, 0)
    expect(timerStatus(store().timers[chave], 0)).toBe('running')

    store().toggle(chave, 5 * MINUTO, MINUTO)
    expect(timerStatus(store().timers[chave], MINUTO)).toBe('paused')
    expect(remainingMs(store().timers[chave], MINUTO)).toBe(4 * MINUTO)
  })

  it('reiniciar volta ao tempo cheio, parado', () => {
    store().toggle(chave, 5 * MINUTO, 0)
    store().reset(chave, 5 * MINUTO)

    expect(timerStatus(store().timers[chave], MINUTO)).toBe('idle')
  })

  it('avisa uma vez só quando o timer acaba', () => {
    store().toggle(chave, MINUTO, 0)

    expect(store().collectFinished(30_000)).toEqual([])
    expect(store().collectFinished(MINUTO)).toEqual([chave])
    expect(store().collectFinished(2 * MINUTO)).toEqual([])
    expect(timerStatus(store().timers[chave], 2 * MINUTO)).toBe('done')
  })

  it('cada passo tem o seu timer', () => {
    store().toggle(timerKey('52772', 1), MINUTO, 0)
    store().toggle(timerKey('52772', 2), 2 * MINUTO, 0)

    expect(store().collectFinished(MINUTO)).toEqual([timerKey('52772', 1)])
  })
})

describe('fila de avisos', () => {
  it('guarda os timers que tocaram até a pessoa dispensar o aviso', () => {
    store().toggle(timerKey('52772', 1), MINUTO, 0)
    store().toggle(timerKey('52772', 2), MINUTO, 0)
    store().collectFinished(MINUTO)

    expect(store().ringing).toEqual([timerKey('52772', 1), timerKey('52772', 2)])

    store().dismissRinging()
    expect(store().ringing).toEqual([timerKey('52772', 2)])
  })
})
