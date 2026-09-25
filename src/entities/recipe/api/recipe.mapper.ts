import { detectCookingMethods } from '../lib/detectCookingMethods'
import { estimateCookTimeMinutes } from '../lib/estimateCookTime'
import { estimateDifficulty } from '../lib/estimateDifficulty'
import { splitSteps } from '../lib/splitSteps'
import type { Ingredient, Recipe, RecipeSummary } from '../model/recipe.types'
import type { MealDto, SummaryDto } from './recipe.dto'

const MAX_INGREDIENTS = 20

// Fronteira do app: daqui para dentro ninguém mais vê strMeal nem strIngredient7.
export function toRecipe(dto: MealDto): Recipe {
  const instructions = dto.strInstructions?.trim() ?? ''
  const steps = instructions ? splitSteps(instructions) : []
  const ingredients = toIngredients(dto)

  return {
    ...toRecipeSummary(dto),
    instructions,
    steps,
    ingredients,
    tags: toTags(dto.strTags),
    youtubeUrl: emptyToUndefined(dto.strYoutube),
    sourceUrl: emptyToUndefined(dto.strSource),
    estimatedMinutes: estimateCookTimeMinutes(steps),
    difficulty: estimateDifficulty({
      ingredientCount: ingredients.length,
      stepCount: steps.length,
    }),
    methods: detectCookingMethods(steps),
  }
}

export function toRecipeSummary(dto: MealDto | SummaryDto): RecipeSummary {
  return {
    id: dto.idMeal,
    name: dto.strMeal,
    thumbnail: dto.strMealThumb,
    category: emptyToUndefined(dto.strCategory),
    // strCountry está em todas as 790 receitas e usa nomes consistentes;
    // strArea falta em 190 delas e mistura "French" com "France"
    area: emptyToUndefined(dto.strCountry) ?? emptyToUndefined(dto.strArea),
  }
}

// Os ingredientes vêm como 20 campos soltos, quase sempre com buracos no fim
function toIngredients(dto: MealDto): Ingredient[] {
  const ingredients: Ingredient[] = []

  for (let position = 1; position <= MAX_INGREDIENTS; position += 1) {
    const name = dto[`strIngredient${position}`]?.trim()
    const measure = dto[`strMeasure${position}`]?.trim()

    if (name) {
      ingredients.push({ name, measure: measure ?? '' })
    }
  }

  return ingredients
}

function toTags(tags: string | null | undefined): string[] {
  return (tags ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

function emptyToUndefined(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()

  return trimmed ? trimmed : undefined
}
