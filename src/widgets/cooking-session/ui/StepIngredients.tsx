import { ListChecks } from 'lucide-react'
import {
  ingredientKey,
  translateIngredient,
  uniqueIngredients,
  useMeasureLabel,
  type Ingredient,
  type MeasureSystem,
} from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { Card } from '@/shared/ui'
import styles from './CookingSession.module.scss'

interface StepIngredientsProps {
  ingredients: Ingredient[]
  servings: number
  system: MeasureSystem
}

// "Ingredientes deste passo" do design, já com as porções e o sistema escolhidos no detalhe
export function StepIngredients({ ingredients, servings, system }: StepIngredientsProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const measureLabel = useMeasureLabel()
  const distinct = uniqueIngredients(ingredients)

  return (
    <Card className={styles.ingredientsCard}>
      <h2 className={styles.ingredientsTitle}>
        <ListChecks size={20} className={styles.ingredientsIcon} aria-hidden="true" />
        {t('cooking.stepIngredients')}
      </h2>

      {distinct.length > 0 ? (
        <ul className={styles.ingredientsList} role="list">
          {distinct.map((ingredient) => (
            <li key={ingredientKey(ingredient)} className={styles.ingredientRow}>
              <span>{translateIngredient(ingredient.name, language)}</span>{' '}
              {ingredient.measure ? (
                <span className={styles.ingredientMeasure}>
                  {measureLabel(ingredient.measure, { servings, system })}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.ingredientsEmpty}>{t('cooking.noStepIngredients')}</p>
      )}
    </Card>
  )
}
