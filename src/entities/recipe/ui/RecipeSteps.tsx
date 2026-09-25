import { Clock, ListOrdered } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Card } from '@/shared/ui'
import { describeSteps } from '../lib/describeSteps'
import { translateIngredient } from '../lib/translateIngredient'
import { ingredientKey, uniqueIngredients } from '../lib/uniqueIngredients'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeSteps.module.scss'
import { useDurationLabel } from './useDurationLabel'

interface RecipeStepsProps {
  recipe: Recipe
}

// O texto dos passos fica em inglês, como veio da API. Tempo e ingredientes de
// cada passo são tirados desse texto, por isso só aparecem quando ele os cita.
export function RecipeSteps({ recipe }: RecipeStepsProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const durationLabel = useDurationLabel()
  const steps = useMemo(() => describeSteps(recipe), [recipe])

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

      <ol className={styles.list} role="list">
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
                  {step.text}
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
