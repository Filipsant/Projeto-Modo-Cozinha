import { describe, expect, it } from 'vitest'
import { createTimer, finishTimer, pauseTimer, remainingMs, startTimer, timerStatus } from './timer'

const MINUTO = 60_000

describe('timer', () => {
  it('começa parado com o tempo cheio', () => {
    const timer = createTimer(5 * MINUTO)

    expect(timerStatus(timer, 0)).toBe('idle')
    expect(remainingMs(timer, 0)).toBe(5 * MINUTO)
  })

  it('conta pelo relógio, e não por quantas vezes a tela atualizou', () => {
    const rodando = startTimer(createTimer(5 * MINUTO), 1_000)

    expect(timerStatus(rodando, 1_000)).toBe('running')
    expect(remainingMs(rodando, 1_000 + 2 * MINUTO)).toBe(3 * MINUTO)
  })

  it('pausa guardando o que falta e continua de onde parou', () => {
    const pausado = pauseTimer(startTimer(createTimer(5 * MINUTO), 0), 2 * MINUTO)

    expect(timerStatus(pausado, 10 * MINUTO)).toBe('paused')
    expect(remainingMs(pausado, 10 * MINUTO)).toBe(3 * MINUTO)

    const retomado = startTimer(pausado, 10 * MINUTO)
    expect(remainingMs(retomado, 11 * MINUTO)).toBe(2 * MINUTO)
  })

  it('acaba quando o tempo chega a zero, sem ficar negativo', () => {
    const rodando = startTimer(createTimer(MINUTO), 0)

    expect(timerStatus(rodando, 2 * MINUTO)).toBe('done')
    expect(remainingMs(rodando, 2 * MINUTO)).toBe(0)
    expect(timerStatus(finishTimer(rodando), 0)).toBe('done')
  })

  it('iniciar de novo depois de acabar volta ao tempo cheio', () => {
    const acabou = finishTimer(startTimer(createTimer(MINUTO), 0))
    const denovo = startTimer(acabou, 5 * MINUTO)

    expect(timerStatus(denovo, 5 * MINUTO)).toBe('running')
    expect(remainingMs(denovo, 5 * MINUTO)).toBe(MINUTO)
  })
})
