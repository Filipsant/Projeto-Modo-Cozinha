import type { ParsedMeasure } from '../model/recipe.types'
import { findUnit, type UnitId } from './measureUnits'

const FRACTIONS: Record<string, number> = {
  '½': 1 / 2,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '¼': 1 / 4,
  '¾': 3 / 4,
  '⅛': 1 / 8,
  '⅜': 3 / 8,
  '⅝': 5 / 8,
  '⅞': 7 / 8,
}
const GLYPHS = Object.keys(FRACTIONS).join('')

// A ordem importa: "1 1/2" antes de "1", senão sobraria " 1/2" como texto
const NUMBER = `\\d+ \\d+\\/\\d+|\\d+ ?[${GLYPHS}]|\\d+\\/\\d+|[${GLYPHS}]|\\d+(?:[.,]\\d+)?`
const LEADING = new RegExp(`^(${NUMBER})(?: ?(?:-|–|to) ?(${NUMBER}))?(.*)$`, 'i')
const PREFIXED = new RegExp(
  `^(?:grated )?(zest and juice|juice and zest|juice/zest|juice|zest) of (${NUMBER}|one|two|three)(.*)$`,
  'i',
)
const UNIT_TOKEN = /^([a-z]+)\.?(?=[\s,(]|$)/i
// "75g/3oz": a receita já dá as duas; ficamos com a primeira. "1/2 cup" não
// entra aqui porque antes da barra precisa haver uma unidade
const DUAL = /^(\d[\d.,]* ?[a-z]+) ?\/ ?\d.*$/i

const WORD_NUMBERS: Record<string, number> = { one: 1, two: 2, three: 3 }

const PREFIX_UNITS: Record<string, UnitId> = {
  juice: 'juice',
  zest: 'zest',
  'zest and juice': 'zestAndJuice',
  'juice and zest': 'zestAndJuice',
  'juice/zest': 'zestAndJuice',
}

/**
 * Lê a medida em texto livre da TheMealDB: "1 1/2 cups", "200g", "2-3",
 * "Pinch", "2 cloves minced", "Juice of 1". O que não for número nem unidade
 * conhecida vai para note, sem se perder.
 */
export function parseMeasure(raw: string): ParsedMeasure {
  const text = raw
    .trim()
    .replace(/\s+/g, ' ')
    // "fl oz" é uma unidade só, e não "fl" seguido de "oz"
    .replace(/\bfl\.? ?oz\b\.?/gi, 'floz')
    .replace(DUAL, '$1')

  const prefixed = PREFIXED.exec(text)

  if (prefixed) {
    return {
      quantity: parseNumber(prefixed[2]),
      quantityMax: null,
      unit: PREFIX_UNITS[prefixed[1].toLowerCase()],
      note: prefixed[3].trim(),
    }
  }

  const leading = LEADING.exec(text)

  if (!leading) {
    // "Pinch" ou "Handful" sozinhos valem uma unidade; "To taste" fica como nota
    const { unit, note } = splitUnit(text)

    return { quantity: unit ? 1 : null, quantityMax: null, unit, note }
  }

  const { unit, note } = splitUnit(leading[3].trim())

  return {
    quantity: parseNumber(leading[1]),
    quantityMax: leading[2] ? parseNumber(leading[2]) : null,
    unit,
    note,
  }
}

function splitUnit(text: string): { unit: UnitId | null; note: string } {
  const token = UNIT_TOKEN.exec(text)
  const unit = token ? findUnit(token[1]) : null

  return unit && token
    ? { unit, note: text.slice(token[0].length).trim() }
    : { unit: null, note: text }
}

function parseNumber(text: string): number {
  const word = WORD_NUMBERS[text.toLowerCase()]

  if (word) return word

  const mixed = /^(\d+) (\d+)\/(\d+)$/.exec(text)

  if (mixed) return Number(mixed[1]) + fraction(mixed[2], mixed[3])

  const withGlyph = new RegExp(`^(\\d*) ?([${GLYPHS}])$`).exec(text)

  if (withGlyph) return Number(withGlyph[1] || 0) + FRACTIONS[withGlyph[2]]

  const simple = /^(\d+)\/(\d+)$/.exec(text)

  if (simple) return fraction(simple[1], simple[2])

  return Number(text.replace(',', '.'))
}

// "1/0" não derruba a tela: vale o numerador
function fraction(numerator: string, denominator: string): number {
  const bottom = Number(denominator)

  return bottom === 0 ? Number(numerator) : Number(numerator) / bottom
}
