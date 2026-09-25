const TIME_MENTION =
  /(\d+(?:[.,]\d+)?)\s*(?:(?:to|a|-|–)\s*\d+(?:[.,]\d+)?\s*)?(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/gi

const TO_MINUTES: Record<string, number> = {
  hour: 60,
  hours: 60,
  hr: 60,
  hrs: 60,
  minute: 1,
  minutes: 1,
  min: 1,
  mins: 1,
  second: 1 / 60,
  seconds: 1 / 60,
  sec: 1 / 60,
  secs: 1 / 60,
}

// Passos em que a comida espera sozinha. Somar esses tempos dava 1.452 minutos
// para um shawarma que marina "por 24 horas": 42 receitas passavam de 4 horas.
const WAITING_STEP =
  /marinat|overnight|refrigerat|fridge|chill|soak|freez|\brest|\bcool|prove|proof|\bstand|\brise|rising/i

/** Minutos por passo: o mínimo, mesmo quando o texto não cita tempo nenhum. */
const MINUTES_PER_STEP = 5

// A API não informa tempo de preparo. Somamos os tempos citados nos passos em
// que a pessoa está cozinhando, e nunca estimamos menos que 5 minutos por passo.
// O resultado é aproximado e a interface mostra como estimativa.
export function estimateCookTimeMinutes(steps: string[]): number {
  let active = 0

  for (const step of steps) {
    if (WAITING_STEP.test(step)) continue

    active += mentionedMinutes(step)
  }

  const minutes = Math.max(active, steps.length * MINUTES_PER_STEP, MINUTES_PER_STEP)

  return Math.round(minutes / 5) * 5
}

/**
 * Tempo que o próprio passo cita, espera incluída: "marinate for 2 hours" dá 120.
 * null quando o texto não fala de tempo, para a tela não inventar um número.
 */
export function stepMinutes(step: string): number | null {
  const minutes = mentionedMinutes(step)

  // "Fry for 30 seconds" vira 1 minuto, e não 0
  return minutes > 0 ? Math.max(1, Math.round(minutes)) : null
}

function mentionedMinutes(step: string): number {
  let minutes = 0

  for (const match of step.matchAll(TIME_MENTION)) {
    minutes += Number(match[1].replace(',', '.')) * TO_MINUTES[match[2].toLowerCase()]
  }

  return minutes
}

/** Separa minutos em horas e minutos, para mostrar "~1 h 30 min" em vez de "~90 min". */
export function splitDuration(totalMinutes: number): { hours: number; minutes: number } {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}
