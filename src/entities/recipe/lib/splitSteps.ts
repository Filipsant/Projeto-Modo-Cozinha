const STEP_PREFIX = /^(?:step|passo)\s*\d+\s*[:.)-]?\s*/i
// "1. Prepare the dough" e "13) Add the bay leaf": a tela já numera os passos.
// Exige o espaço depois do ponto para não comer o "2" de "2.5 cups"
const NUMBER_PREFIX = /^\d{1,2}\s*[.)]\s+/
// Caixinhas e marcadores copiados de sites de receita, como o "▢" que vem sozinho na linha
const BULLET_PREFIX = /^[▢☐□•·*–-]+\s*/
// Espaços invisíveis (U+200B a U+200D e U+FEFF): a linha parece vazia, mas não é
const INVISIBLE = /[\u200B-\u200D\uFEFF]/g
// Linhas que só anunciam a lista de passos
const SECTION_LABEL = /^(?:instructions?|directions?|method|preparation|preperation|steps?)\s*:?$/i

// As instruções chegam num campo só. Quebramos por linha; quando a receita vem
// num bloco único, caímos para a divisão por frase (risco previsto no roadmap).
export function splitSteps(instructions: string): string[] {
  const byLine = instructions
    .split(/\r?\n+/)
    .map(cleanLine)
    .filter(hasContent)

  if (byLine.length > 1) {
    return byLine
  }

  const text = byLine[0] ?? cleanLine(instructions)

  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])/)
    .map((sentence) => sentence.trim())
    .filter(hasContent)
}

function cleanLine(line: string): string {
  return line
    .replace(INVISIBLE, '')
    .trim()
    .replace(BULLET_PREFIX, '')
    .replace(STEP_PREFIX, '')
    .replace(NUMBER_PREFIX, '')
    .trim()
}

// Passo sem nenhuma letra não diz nada: é o "2" de uma lista numerada ou o "▢"
// de uma caixinha, que virariam cartões vazios na tela
function hasContent(line: string): boolean {
  return /\p{L}/u.test(line) && !SECTION_LABEL.test(line)
}
