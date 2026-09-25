export interface Timer {
  durationMs: number
  /** Rodando: o instante em que acaba. Parado ou pausado: null. */
  endsAt: number | null
  /** Parado ou pausado: quanto falta. Rodando, quem manda é endsAt. */
  remainingMs: number
  /** Já tocou o alarme: evita tocar duas vezes. */
  finished: boolean
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

export function createTimer(durationMs: number): Timer {
  return { durationMs, endsAt: null, remainingMs: durationMs, finished: false }
}

export function remainingMs(timer: Timer, now: number): number {
  return timer.endsAt === null ? timer.remainingMs : Math.max(0, timer.endsAt - now)
}

export function timerStatus(timer: Timer, now: number): TimerStatus {
  if (timer.finished || remainingMs(timer, now) === 0) return 'done'
  if (timer.endsAt !== null) return 'running'

  return timer.remainingMs < timer.durationMs ? 'paused' : 'idle'
}

export function startTimer(timer: Timer, now: number): Timer {
  // Recomeçar um timer que já acabou volta ao tempo cheio
  const remaining = timerStatus(timer, now) === 'done' ? timer.durationMs : timer.remainingMs

  return { ...timer, endsAt: now + remaining, remainingMs: remaining, finished: false }
}

export function pauseTimer(timer: Timer, now: number): Timer {
  return { ...timer, endsAt: null, remainingMs: remainingMs(timer, now) }
}

export function finishTimer(timer: Timer): Timer {
  return { ...timer, endsAt: null, remainingMs: 0, finished: true }
}
