interface UnitDefinition {
  /** volume e peso convertem para ml e g; count só multiplica ("2 dentes"). */
  kind: 'volume' | 'weight' | 'count'
  /** Quantos ml ou g cabem em uma unidade. */
  base?: number
  /** Já é do sistema métrico: mostra decimal ("1,5 kg"), nunca fração. */
  metric?: boolean
  /** O nome vem antes do número: "suco de 2", e não "2 suco". */
  prefix?: boolean
  /** Como a TheMealDB escreve, em minúsculas e sem ponto final. */
  aliases: string[]
}

// Equivalências culinárias usuais: 1 xícara = 240 ml, 1 colher de sopa = 15 ml
export const UNITS = {
  cup: { kind: 'volume', base: 240, aliases: ['cup', 'cups'] },
  tbsp: {
    kind: 'volume',
    base: 15,
    aliases: ['tbsp', 'tbsps', 'tbs', 'tbls', 'tblsp', 'tbl', 'tablespoon', 'tablespoons'],
  },
  tsp: { kind: 'volume', base: 5, aliases: ['tsp', 'tsps', 'teaspoon', 'teaspoons'] },
  floz: { kind: 'volume', base: 30, aliases: ['floz'] },
  pint: { kind: 'volume', base: 473, aliases: ['pint', 'pints', 'pt'] },
  quart: { kind: 'volume', base: 946, aliases: ['quart', 'quarts', 'qt'] },
  ml: {
    kind: 'volume',
    base: 1,
    metric: true,
    aliases: ['ml', 'mls', 'millilitre', 'millilitres', 'milliliter', 'milliliters'],
  },
  l: {
    kind: 'volume',
    base: 1000,
    metric: true,
    aliases: ['l', 'ltr', 'litre', 'litres', 'liter', 'liters'],
  },
  oz: { kind: 'weight', base: 28.35, aliases: ['oz', 'ounce', 'ounces'] },
  lb: { kind: 'weight', base: 453.6, aliases: ['lb', 'lbs', 'pound', 'pounds'] },
  g: {
    kind: 'weight',
    base: 1,
    metric: true,
    aliases: ['g', 'gr', 'grs', 'gram', 'grams', 'gramme', 'grammes'],
  },
  kg: {
    kind: 'weight',
    base: 1000,
    metric: true,
    aliases: ['kg', 'kgs', 'kilo', 'kilos', 'kilogram', 'kilograms'],
  },
  pinch: { kind: 'count', aliases: ['pinch', 'pinches'] },
  dash: { kind: 'count', aliases: ['dash', 'dashes'] },
  splash: { kind: 'count', aliases: ['splash', 'splashes'] },
  handful: { kind: 'count', aliases: ['handful', 'handfuls', 'handfull'] },
  knob: { kind: 'count', aliases: ['knob', 'knobs'] },
  packet: { kind: 'count', aliases: ['packet', 'packets', 'pack', 'packs', 'bag', 'bags'] },
  jar: { kind: 'count', aliases: ['jar', 'jars', 'pot', 'pots', 'tub', 'tubs'] },
  head: { kind: 'count', aliases: ['head', 'heads', 'bulb', 'bulbs'] },
  strip: { kind: 'count', aliases: ['strip', 'strips'] },
  clove: { kind: 'count', aliases: ['clove', 'cloves'] },
  can: { kind: 'count', aliases: ['can', 'cans', 'tin', 'tins'] },
  slice: { kind: 'count', aliases: ['slice', 'slices'] },
  sprig: { kind: 'count', aliases: ['sprig', 'sprigs'] },
  bunch: { kind: 'count', aliases: ['bunch', 'bunches'] },
  piece: { kind: 'count', aliases: ['piece', 'pieces'] },
  leaf: { kind: 'count', aliases: ['leaf', 'leaves'] },
  juice: { kind: 'count', prefix: true, aliases: [] },
  zest: { kind: 'count', prefix: true, aliases: [] },
  zestAndJuice: { kind: 'count', prefix: true, aliases: [] },
} as const satisfies Record<string, UnitDefinition>

export type UnitId = keyof typeof UNITS

const BY_ALIAS = new Map<string, UnitId>(
  (Object.keys(UNITS) as UnitId[]).flatMap((id) =>
    UNITS[id].aliases.map((alias): [string, UnitId] => [alias, id]),
  ),
)

export function findUnit(token: string): UnitId | null {
  return BY_ALIAS.get(token.toLowerCase().replace(/\.$/, '')) ?? null
}

export function unitDefinition(unit: UnitId): UnitDefinition {
  return UNITS[unit]
}
