import { Clock, Languages, ListOrdered } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { Card, SkeletonText } from '@/shared/ui'
import { translateIngredient } from '../lib/translateIngredient'
import { ingredientKey, uniqueIngredients } from '../lib/uniqueIngredients'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeSteps.module.scss'
import { useDurationLabel } from './useDurationLabel'
import { useRecipeSteps, type StepsStatus } from './useRecipeSteps'

interface RecipeStepsProps {
  recipe: Recipe
}

// O texto dos passos aparece no idioma da interface, traduzido do inglês da API.
// Tempo e ingredientes de cada passo são tirados do original, por isso só
// aparecem quando o passo os cita.
export function RecipeSteps({ recipe }: RecipeStepsProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const durationLabel = useDurationLabel()
  const { steps, status } = useRecipeSteps(recipe)

  return (
    <section className={styles.section} aria-labelledby="titulo-preparo">
      <div className={styles.header}>
        <h2 id="titulo-preparo" className={styles.title}>
          <ListOrdered size={24} className={styles.titleIcon} aria-hidden="true" />
          {t('recipeDetails.stepsTitle')}
        </h2>
        <span className={styles.count}>
          {t('recipeDetails.stepsCount', { count: steps.length })}
        </span>
      </div>

      <TranslationNote status={status} />

      <ol className={styles.list} role="list" aria-busy={status === 'translating'}>
        {steps.map((step) => (
          <li key={step.number}>
            <Card className={styles.step}>
              <span
                className={step.number === 1 ? `${styles.number} ${styles.first}` : styles.number}
                aria-hidden="true"
              >
                {step.number}
              </span>

              <div className={styles.content}>
                <p className={styles.text}>
                  <span className={styles.visuallyHidden}>
                    {t('recipeDetails.step', { number: step.number })}:{' '}
                  </span>
                  {status === 'translating' ? <SkeletonText lines={2} /> : step.text}
                </p>

                {step.minutes ? (
                  <span className={styles.time}>
                    <Clock size={14} aria-hidden="true" />
                    {durationLabel(step.minutes)}
                  </span>
                ) : null}

                {step.ingredients.length > 0 ? (
                  <p className={styles.ingredients}>
                    <span className={styles.ingredientsLabel}>
                      {t('recipeDetails.stepIngredients')}
                    </span>
                    {uniqueIngredients(step.ingredients).map((ingredient) => (
                      <span key={ingredientKey(ingredient)} className={styles.ingredient}>
                        {translateIngredient(ingredient.name, language)}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Tradução de máquina avisa que é de máquina; sem tradução, avisa por que está em inglês
function TranslationNote({ status }: { status: StepsStatus }) {
  const { t } = useTranslation()

  if (status === 'translated') {
    return (
      <p className={styles.note}>
        <Languages size={16} aria-hidden="true" />
        {t('recipe.translatedNote')}
      </p>
    )
  }

  if (status === 'failed') {
    return (
      <p className={`${styles.note} ${styles.noteWarning}`} role="status">
        <Languages size={16} aria-hidden="true" />
        {t('recipe.translationFailed')}
      </p>
    )
  }

  return null
}
