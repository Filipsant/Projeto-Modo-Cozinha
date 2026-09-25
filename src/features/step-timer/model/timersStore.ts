import { create } from 'zustand'
import {
  createTimer,
  finishTimer,
  pauseTimer,
  remainingMs,
  startTimer,
  timerStatus,
  type Timer,
} from '../lib/timer'

interface TimersState {
  /** Um timer por passo, com a chave "receita:passo". */
  timers: Record<string, Timer>
  toggle: (key: string, durationMs: number, now?: number) => void
  reset: (key: string, durationMs: number) => void
  /** Os que acabaram e ainda esperam a pessoa ver o aviso, na ordem em que tocaram. */
  ringing: string[]
  /** Marca como acabados os que chegaram a zero, põe na fila de avisos e devolve as chaves. */
  collectFinished: (now?: number) => string[]
  dismissRinging: () => void
}

// Fica na memória, fora do componente: o timer do molho continua correndo
// enquanto a pessoa avança para o próximo passo.
export const useTimersStore = create<TimersState>()((set, get) => ({
  timers: {},
  ringing: [],

  toggle(key, durationMs, now = Date.now()) {
    const timer = get().timers[key] ?? createTimer(durationMs)
    const next =
      timerStatus(timer, now) === 'running' ? pauseTimer(timer, now) : startTimer(timer, now)

    set((state) => ({ timers: { ...state.timers, [key]: next } }))
  },

  reset(key, durationMs) {
    set((state) => ({ timers: { ...state.timers, [key]: createTimer(durationMs) } }))
  },

  collectFinished(now = Date.now()) {
    const finished = Object.entries(get().timers)
      .filter(
        ([, timer]) => !timer.finished && timer.endsAt !== null && remainingMs(timer, now) === 0,
      )
      .map(([key]) => key)

    if (finished.length > 0) {
      set((state) => ({
        timers: {
          ...state.timers,
          ...Object.fromEntries(finished.map((key) => [key, finishTimer(state.timers[key])])),
        },
        ringing: [...state.ringing, ...finished],
      }))
    }

    return finished
  },

  dismissRinging() {
    set((state) => ({ ringing: state.ringing.slice(1) }))
  },
}))

/** Há algum timer correndo? Só então a tela precisa atualizar a cada segundo. */
export function useHasRunningTimer(): boolean {
  return useTimersStore((state) =>
    Object.values(state.timers).some((timer) => timer.endsAt !== null),
  )
}

export function timerKey(recipeId: string, step: number): string {
  return `${recipeId}:${step}`
}
