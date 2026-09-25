import type { Recipe, RecipeStep } from '../model/recipe.types'
import { stepMinutes } from './estimateCookTime'
import { ingredientsInStep } from './ingredientsInStep'

/** Cada passo com o tempo e os ingredientes que ele cita: o detalhe e o modo cozinha usam isto. */
export function describeSteps(recipe: Pick<Recipe, 'steps' | 'ingredients'>): RecipeStep[] {
  return recipe.steps.map((text, index) => ({
    number: index + 1,
    text,
    minutes: stepMinutes(text),
    ingredients: ingredientsInStep(text, recipe.ingredients),
  }))
}
