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

/** Minutos por passo quando o texto não menciona nenhum tempo. */
const MINUTES_PER_STEP = 5

// A API não informa tempo de preparo. Somamos os tempos citados no texto das
// instruções; sem nenhuma menção, estimamos pelo número de passos. O resultado
// é aproximado e a interface precisa mostrá-lo como estimativa.
export function estimateCookTimeMinutes(steps: string[]): number {
  const text = steps.join(' ')
  let total = 0

  for (const match of text.matchAll(TIME_MENTION)) {
    const amount = Number(match[1].replace(',', '.'))
    const unit = match[2].toLowerCase()
    total += amount * TO_MINUTES[unit]
  }

  const minutes = total > 0 ? total : steps.length * MINUTES_PER_STEP

  return roundToFive(Math.max(5, minutes))
}

function roundToFive(minutes: number): number {
  return Math.round(minutes / 5) * 5
}
