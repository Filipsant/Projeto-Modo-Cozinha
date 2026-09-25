// O que sobra da medida depois do número e da unidade: "large", "minced",
// "To taste". Frases inteiras primeiro; depois, palavra por palavra.
const PHRASES_PT_BR: Record<string, string> = {
  'to taste': 'a gosto',
  'as required': 'a gosto',
  'as needed': 'a gosto',
  'to serve': 'para servir',
  'for serving': 'para servir',
  garnish: 'para decorar',
  'to garnish': 'para decorar',
  'for garnish': 'para decorar',
  'for frying': 'para fritar',
  topping: 'para cobrir',
  'for topping': 'para cobrir',
  sprinkling: 'para polvilhar',
  // Grafias erradas que aparecem mais de uma vez no catálogo
  sprinking: 'para polvilhar',
  spinkling: 'para polvilhar',
  dusting: 'para polvilhar',
  'for brushing': 'para pincelar',
  'to glaze': 'para pincelar',
  top: 'para cobrir',
  drizzle: 'um fio',
  'thinly sliced': 'em fatias finas',
  'sliced thinly': 'em fatias finas',
  'of fresh': 'fresco',
  'free-range': 'caipira',
}

// [singular, plural]: "1 grande", "2 grandes"
const WORDS_PT_BR: Record<string, [string, string]> = {
  large: ['grande', 'grandes'],
  medium: ['médio', 'médios'],
  small: ['pequeno', 'pequenos'],
  chopped: ['picado', 'picados'],
  minced: ['picado', 'picados'],
  sliced: ['fatiado', 'fatiados'],
  diced: ['em cubos', 'em cubos'],
  cubed: ['em cubos', 'em cubos'],
  grated: ['ralado', 'ralados'],
  crushed: ['amassado', 'amassados'],
  peeled: ['descascado', 'descascados'],
  beaten: ['batido', 'batidos'],
  melted: ['derretido', 'derretidos'],
  softened: ['amolecido', 'amolecidos'],
  shredded: ['desfiado', 'desfiados'],
  halved: ['cortado ao meio', 'cortados ao meio'],
  cooked: ['cozido', 'cozidos'],
  drained: ['escorrido', 'escorridos'],
  mashed: ['amassado', 'amassados'],
  boiled: ['cozido', 'cozidos'],
  steamed: ['no vapor', 'no vapor'],
  ground: ['moído', 'moídos'],
  skinned: ['sem pele', 'sem pele'],
  separated: ['separado', 'separados'],
  seperated: ['separado', 'separados'],
  hot: ['quente', 'quentes'],
  dried: ['seco', 'secos'],
  finely: ['bem', 'bem'],
  fresh: ['fresco', 'frescos'],
  whole: ['inteiro', 'inteiros'],
  and: ['e', 'e'],
  or: ['ou', 'ou'],
}

/**
 * Traduz a nota para português quando todas as palavras são conhecidas. Se
 * alguma não for, devolve o original: meia tradução confunde mais que nenhuma.
 */
export function translateMeasureNote(note: string, language: string, count: number): string {
  const text = note.trim()

  if (!text || !language.startsWith('pt')) return text

  const key = text.toLowerCase()

  if (PHRASES_PT_BR[key]) return PHRASES_PT_BR[key]

  const words = key.split(/[\s,]+/).filter(Boolean)

  if (!words.every((word) => WORDS_PT_BR[word])) return text

  return words.map((word) => WORDS_PT_BR[word][count > 1 ? 1 : 0]).join(' ')
}
