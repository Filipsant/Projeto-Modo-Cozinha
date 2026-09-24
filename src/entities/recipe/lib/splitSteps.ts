const STEP_PREFIX = /^(?:step|passo)\s*\d+\s*[:.)-]?\s*/i
const ONLY_STEP_LABEL = /^(?:step|passo)\s*\d+\s*[:.)-]?$/i

// As instruções chegam num campo só. Quebramos por linha; quando a receita vem
// num bloco único, caímos para a divisão por frase (risco previsto no roadmap).
export function splitSteps(instructions: string): string[] {
  const byLine = instructions
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !ONLY_STEP_LABEL.test(line))
    .map((line) => line.replace(STEP_PREFIX, '').trim())
    .filter((line) => line.length > 0)

  if (byLine.length > 1) {
    return byLine
  }

  const text = byLine[0] ?? instructions.trim()

  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
}
