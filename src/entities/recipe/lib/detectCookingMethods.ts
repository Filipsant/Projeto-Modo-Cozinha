import type { CookingMethod } from '../model/recipe.types'

const OVEN = /\boven\b|\bbak(?:e|ed|es|ing)\b|\broast/i
const GRILL = /\bgrill|\bbarbecue|\bbbq\b|\bbroil/i
// "baking pan" e "roasting pan" vão ao forno: não contam como fogão
const STOVETOP =
  /\b(?:sauce)?(?<!baking |roasting |sheet |cake |loaf |tart |muffin |springform )pan\b|\bpot\b|\bskillet|\bwok\b|\bsimmer|\bboil|\bfr(?:y|ies|ied)\b|\bsaut[eé]|\bsear|\bsteam|\bpoach|\bheat\b/i

// Cada passo conta para um método só. Forno e grelha vêm antes porque o passo
// que leva ao forno quase sempre cita a panela: "place in the pan and bake".
// A ordem também desempata: com três passos de forno e três de fogão, o forno vem primeiro.
const PATTERNS: [Exclude<CookingMethod, 'noCook'>, RegExp][] = [
  ['oven', OVEN],
  ['grill', GRILL],
  ['stovetop', STOVETOP],
]

/** No máximo dois: "Forno + Fogão" cabe no cartão, uma lista de três não. */
const MAX_METHODS = 2

/**
 * Onde a receita é feita, pelo que os passos dizem. A API não informa: contamos
 * quantos passos usam cada método e mostramos os mais usados primeiro.
 */
export function detectCookingMethods(steps: string[]): CookingMethod[] {
  const count = new Map<CookingMethod, number>()

  for (const step of steps) {
    const match = PATTERNS.find(([, pattern]) => pattern.test(step))

    if (match) count.set(match[0], (count.get(match[0]) ?? 0) + 1)
  }

  const methods = PATTERNS.map(([method]) => method)
    .filter((method) => count.has(method))
    // sort é estável: no empate vale a ordem de PATTERNS
    .sort((a, b) => count.get(b)! - count.get(a)!)
    .slice(0, MAX_METHODS)

  return methods.length > 0 ? methods : ['noCook']
}
