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
}
