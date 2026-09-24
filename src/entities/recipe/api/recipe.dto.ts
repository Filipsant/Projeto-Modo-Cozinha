import { z } from 'zod'

// Formato cru da TheMealDB. Todos os campos são string ou null, inclusive os 20
// pares strIngredient1..20 / strMeasure1..20, que o catchall cobre.
const mealDto = z
  .object({
    idMeal: z.string(),
    strMeal: z.string(),
    strMealThumb: z.string(),
    strCategory: z.string().nullish(),
    strArea: z.string().nullish(),
    strCountry: z.string().nullish(),
    strInstructions: z.string().nullish(),
    strTags: z.string().nullish(),
    strYoutube: z.string().nullish(),
    strSource: z.string().nullish(),
  })
  .catchall(z.string().nullish())

// filter.php devolve só estes três campos, então o resumo é um schema próprio
const summaryDto = z
  .object({
    idMeal: z.string(),
    strMeal: z.string(),
    strMealThumb: z.string(),
  })
  .catchall(z.string().nullish())

// "nenhum resultado" chega como { "meals": null }, e não como lista vazia
export const mealsResponseDto = z.object({ meals: z.array(mealDto).nullable() })
export const summariesResponseDto = z.object({ meals: z.array(summaryDto).nullable() })

export const categoriesResponseDto = z.object({
  categories: z.array(z.object({ idCategory: z.string(), strCategory: z.string() })),
})

export const areasResponseDto = z.object({
  meals: z.array(z.object({ strArea: z.string() })).nullable(),
})

export type MealDto = z.infer<typeof mealDto>
export type SummaryDto = z.infer<typeof summaryDto>
