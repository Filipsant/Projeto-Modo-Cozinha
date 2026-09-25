import type { UnitId } from '../lib/measureUnits'

export interface Ingredient {
  name: string
  /** Medida como veio da API, em texto livre: "1/2 cup", "200g", "to taste". */
  measure: string
}

/** O que os filtros da API devolvem: só o suficiente para montar um cartão. */
export interface RecipeSummary {
  id: string
  name: string
  thumbnail: string
  category?: string
  area?: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

/** metric: tudo em g e ml. original: as unidades da receita, como xícara e onça. */
export type MeasureSystem = 'metric' | 'original'

/** A medida em texto livre da API, separada em partes que dá para multiplicar. */
export interface ParsedMeasure {
  /** null quando o texto não tem número: "To taste". */
  quantity: number | null
  /** O fim da faixa em "2-3"; null quando é um número só. */
  quantityMax: number | null
  unit: UnitId | null
  /** O que sobrou, como "large" ou "minced". */
  note: string
}

/** noCook: nenhum passo cita fogo, forno ou grelha, como numa salada. */
export type CookingMethod = 'stovetop' | 'oven' | 'grill' | 'noCook'

export interface RecipeStep {
  /** Começa em 1, como na tela. */
  number: number
  text: string
  /** Tempo que o passo cita; null quando o texto não fala de tempo. */
  minutes: number | null
  /** Ingredientes que o texto do passo menciona. */
  ingredients: Ingredient[]
}

export interface Recipe extends RecipeSummary {
  instructions: string
  steps: string[]
  ingredients: Ingredient[]
  tags: string[]
  youtubeUrl?: string
  sourceUrl?: string
  /** Estimativa nossa: a API não informa tempo de preparo. */
  estimatedMinutes: number
  /** Estimativa nossa: a API não informa dificuldade. */
  difficulty: Difficulty
  /** Estimativa nossa, pelos passos: fogão, forno, grelha ou sem fogo. */
  methods: CookingMethod[]
}
