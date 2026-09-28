import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from '@/shared/i18n'
import { recipeQueries } from '../api/recipe.queries'
import { describeSteps } from '../lib/describeSteps'
import type { Recipe, RecipeStep } from '../model/recipe.types'

/**
 * original: a interface está em inglês, o idioma da receita.
 * translating: a tradução ainda está chegando.
 * translated: o texto já está no idioma da interface.
 * failed: sem tradução (sem internet, por exemplo); os passos ficam em inglês.
 */
export type StepsStatus = 'original' | 'translating' | 'translated' | 'failed'

interface RecipeStepsResult {
  steps: RecipeStep[]
  status: StepsStatus
  /** Idioma do texto dos passos, para destacar os ingredientes do jeito certo. */
  language: 'en' | 'pt'
}

/**
 * Os passos da receita no idioma da interface. Tempo e ingredientes de cada passo
 * são tirados do texto original, em inglês, que é o que as regras entendem; só o
 * texto que aparece na tela é trocado pela tradução.
 */
export function useRecipeSteps(recipe: Recipe): RecipeStepsResult {
  const { i18n } = useTranslation()
  const wantsPortuguese = (i18n.resolvedLanguage ?? 'pt-BR').startsWith('pt')
  const described = useMemo(() => describeSteps(recipe), [recipe])
  const needsTranslation = wantsPortuguese && described.length > 0
  const translation = useQuery({
    ...recipeQueries.translatedSteps(recipe, 'pt'),
    enabled: needsTranslation,
  })
  const translated = needsTranslation ? translation.data : undefined

  const steps = useMemo(
    () =>
      translated
        ? described.map((step, index) => ({ ...step, text: translated[index] || step.text }))
        : described,
    [described, translated],
  )

  if (!needsTranslation) return { steps, status: 'original', language: 'en' }
  if (translated) return { steps, status: 'translated', language: 'pt' }

  return { steps, status: translation.isError ? 'failed' : 'translating', language: 'en' }
}
