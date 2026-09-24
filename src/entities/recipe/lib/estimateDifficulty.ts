import type { Difficulty } from '../model/recipe.types'

interface DifficultyInput {
  ingredientCount: number
  stepCount: number
}

// A API não informa dificuldade. Usamos o tamanho da receita como proxy: cada
// passo pesa mais que um ingrediente, porque é onde mora a técnica.
export function estimateDifficulty({ ingredientCount, stepCount }: DifficultyInput): Difficulty {
  const weight = ingredientCount + stepCount * 1.5

  if (weight <= 12) return 'easy'
  if (weight <= 22) return 'medium'

  return 'hard'
}
