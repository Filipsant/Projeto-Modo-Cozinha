import type { Ingredient } from '../model/recipe.types'
import { translateIngredient } from './translateIngredient'

// Palavras que dizem a forma, e não o alimento: em "garlic clove" o passo
// costuma falar só "garlic", então é por ela que procuramos
const FORM_WORDS = new Set([
  'clove',
  'leaf',
  'stick',
  'cube',
  'powder',
  'flake',
  'seed',
  'sprig',
  'fillet',
  'juice',
])

// Adjetivos que não servem para achar o ingrediente sozinhos: "fresh" ou "red"
// aparecem em qualquer passo
const DESCRIPTORS = new Set([
  'baby',
  'black',
  'boiling',
  'brown',
  'caster',
  'chopped',
  'cold',
  'dark',
  'double',
  'dried',
  'extra',
  'fresh',
  'frozen',
  'granulated',
  'green',
  'ground',
  'heavy',
  'hot',
  'icing',
  'king',
  'kosher',
  'large',
  'light',
  'medium',
  'minced',
  'plain',
  'powdered',
  'raw',
  'red',
  'salted',
  'sea',
  'single',
  'small',
  'sour',
  'spring',
  'sweet',
  'unsalted',
  'virgin',
  'warm',
  'white',
  'whole',
  'yellow',
])

/**
 * Os ingredientes que o texto do passo menciona, na ordem da receita.
 * A API não diz isso: comparamos os nomes em inglês com o texto, também em inglês.
 */
export function ingredientsInStep(step: string, ingredients: Ingredient[]): Ingredient[] {
  const text = step.toLowerCase()
  const heads = headsOf(ingredients)

  return ingredients.filter((ingredient) => matchedPhrase(text, ingredient, heads) !== null)
}

export interface StepSegment {
  text: string
  /** É o nome de um ingrediente: o modo cozinha mostra em negrito, como no design. */
  ingredient: boolean
}

/**
 * Corta o texto do passo em pedaços, marcando onde cada ingrediente aparece.
 * Com o passo traduzido (language 'pt'), procura os nomes do dicionário em português.
 */
export function highlightIngredients(
  step: string,
  ingredients: Ingredient[],
  language: 'en' | 'pt' = 'en',
): StepSegment[] {
  const alternatives =
    language === 'pt' ? portugueseAlternatives(ingredients) : englishAlternatives(step, ingredients)

  if (alternatives.length === 0) return [{ text: step, ingredient: false }]

  // A busca corre no texto sem acento e em minúsculas, que tem o mesmo tamanho
  // do original: as posições achadas lá cortam o texto de verdade
  const pattern = new RegExp(`\\b(?:${alternatives.join('|')})\\b`, 'g')
  const segments: StepSegment[] = []
  let cursor = 0

  for (const match of fold(step).matchAll(pattern)) {
    const end = match.index + match[0].length

    if (match.index > cursor)
      segments.push({ text: step.slice(cursor, match.index), ingredient: false })
    segments.push({ text: step.slice(match.index, end), ingredient: true })
    cursor = end
  }

  if (cursor < step.length) segments.push({ text: step.slice(cursor), ingredient: false })

  return segments
}

function englishAlternatives(step: string, ingredients: Ingredient[]): string[] {
  const text = step.toLowerCase()
  const heads = headsOf(ingredients)
  const phrases = ingredients
    .map((ingredient) => matchedPhrase(text, ingredient, heads))
    .filter((phrase): phrase is string => phrase !== null)

  // O mais longo primeiro: "soy sauce" inteiro, e não só "sauce"
  return [...new Set(phrases.map(fold))].sort((a, b) => b.length - a.length).map(pluralPattern)
}

// Palavras que sozinhas não dizem qual é o ingrediente: "de" em "molho de soja",
// ou "picado" em "alho picado"
const PORTUGUESE_FILLERS = new Set([
  'a',
  'as',
  'com',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'o',
  'os',
  'ou',
  'para',
  'po',
  'sem',
  'branca',
  'branco',
  'cozida',
  'cozido',
  'extra',
  'fatiada',
  'fatiado',
  'fresca',
  'fresco',
  'grande',
  'media',
  'medio',
  'moida',
  'moido',
  'pequena',
  'pequeno',
  'picada',
  'picado',
  'preta',
  'preto',
  'ralada',
  'ralado',
  'seca',
  'seco',
  'verde',
  'vermelha',
  'vermelho',
  'virgem',
])

// O nome inteiro ("molho de soja") e cada palavra que identifica o ingrediente
// ("frango" em "peito de frango"), aceitando o plural: "peitos de frango"
function portugueseAlternatives(ingredients: Ingredient[]): string[] {
  const phrases = ingredients.flatMap((ingredient) => {
    const words = fold(translateIngredient(ingredient.name, 'pt-BR')).split(/\s+/).filter(Boolean)
    const keywords = words.filter((word) => word.length >= 3 && !PORTUGUESE_FILLERS.has(word))

    return [words, ...keywords.map((word) => [word])]
  })

  return [...new Set(phrases.map((words) => words.map(portuguesePlural).join('\\s+')))].sort(
    (a, b) => b.length - a.length,
  )
}

function portuguesePlural(word: string): string {
  const escaped = escapeRegExp(word)

  return PORTUGUESE_FILLERS.has(word) ? escaped : `${escaped}(?:s|es)?`
}

// Minúsculas e sem acento, letra por letra, para o resultado ter o tamanho do original
function fold(text: string): string {
  return Array.from(text, (char) => {
    const folded = char
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()

    return folded.length === char.length ? folded : char
  }).join('')
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function headsOf(ingredients: Ingredient[]): Set<string> {
  return new Set(ingredients.map((ingredient) => headWord(words(ingredient.name))))
}

// O trecho do nome que aparece no passo: o nome inteiro, o substantivo principal
// ou, em último caso, a primeira palavra. null quando o passo não cita o ingrediente.
function matchedPhrase(text: string, ingredient: Ingredient, heads: Set<string>): string | null {
  const nameWords = words(ingredient.name)
  const fullName = nameWords.join(' ')
  const head = headWord(nameWords)

  if (mentions(text, fullName)) return fullName
  if (mentions(text, head)) return head

  // "chicken breasts" também vale quando o passo diz só "chicken", desde que
  // nenhum outro ingrediente da receita se chame "chicken"
  const first = nameWords[0]
  const firstCounts =
    nameWords.length > 1 && !DESCRIPTORS.has(first) && !heads.has(first) && mentions(text, first)

  return firstCounts ? first : null
}

function words(name: string): string[] {
  return name.toLowerCase().trim().split(/\s+/).map(singular)
}

// O substantivo principal: a última palavra, ou a anterior quando a última é só a forma
function headWord(nameWords: string[]): string {
  const last = nameWords.at(-1) ?? ''

  return FORM_WORDS.has(last) && nameWords.length > 1 ? nameWords.at(-2)! : last
}

// "cloves" e "olives" só perdem o s; estes três trocam o "ves" por "f"
const F_PLURALS: Record<string, string> = { leaves: 'leaf', loaves: 'loaf', halves: 'half' }

function singular(word: string): string {
  if (F_PLURALS[word]) return F_PLURALS[word]
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (/(?:oes|ches|shes|xes)$/.test(word)) return word.slice(0, -2)
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)

  return word
}

// Palavra inteira, aceitando o plural: "onion" acha "onions", mas "salt" não acha "salted"
function mentions(text: string, phrase: string): boolean {
  if (phrase.length < 3) return false

  return new RegExp(`\\b${pluralPattern(phrase)}\\b`).test(text)
}

function pluralPattern(phrase: string): string {
  const escaped = escapeRegExp(phrase)

  if (escaped.endsWith('y')) return `${escaped.slice(0, -1)}(?:y|ies)`
  if (escaped.endsWith('f')) return `${escaped.slice(0, -1)}(?:f|ves)`

  return `${escaped}(?:s|es)?`
}
