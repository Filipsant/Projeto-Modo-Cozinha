import { ListChecks } from 'lucide-react'
import { useState } from 'react'
import {
  translateIngredient,
  useMeasureLabel,
  type Ingredient,
  type MeasureSystem,
} from '@/entities/recipe'
import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { Card } from '@/shared/ui'
import styles from './IngredientChecklist.module.scss'

interface IngredientChecklistProps {
  ingredients: Ingredient[]
  /** Porções pedidas: as medidas são multiplicadas a partir da base de 4. */
  servings?: number
  system?: MeasureSystem
}

// A pessoa separa os ingredientes na bancada e vai marcando o que já pegou.
// Quem usa o componente passa key={recipe.id}: trocar de receita zera as marcas.
export function IngredientChecklist({
  ingredients,
  servings = BASE_SERVINGS,
  system = 'original',
}: IngredientChecklistProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const measureLabel = useMeasureLabel()
  const [checked, setChecked] = useState<ReadonlySet<number>>(() => new Set())
  const allChecked = ingredients.length > 0 && checked.size === ingredients.length

  function toggle(position: number) {
    setChecked((current) => {
      const next = new Set(current)

      if (!next.delete(position)) next.add(position)

      return next
    })
  }

  function toggleAll() {
    setChecked(allChecked ? new Set() : new Set(ingredients.map((_, position) => position)))
  }

  return (
    <Card className={styles.card}>
      <section aria-labelledby="titulo-ingredientes">
        <div className={styles.header}>
          <h2 id="titulo-ingredientes" className={styles.title}>
            <ListChecks size={24} className={styles.titleIcon} aria-hidden="true" />
            {t('recipeDetails.ingredientsTitle')}
          </h2>

          <div className={styles.progress}>
            {/* Anuncia a contagem a cada marcação, para quem não vê as caixas */}
            <span role="status">
              {t('recipeDetails.ingredientsChecked', {
                checked: checked.size,
                total: ingredients.length,
              })}
            </span>
            <button type="button" className={styles.toggleAll} onClick={toggleAll}>
              {allChecked ? t('recipeDetails.uncheckAll') : t('recipeDetails.checkAll')}
            </button>
          </div>
        </div>

        <ul className={styles.list} role="list">
          {ingredients.map((ingredient, position) => (
            <li key={`${ingredient.name}-${position}`}>
              {/* A linha inteira é o rótulo: dá para marcar tocando em qualquer ponto dela */}
              <label className={styles.row}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checked.has(position)}
                  onChange={() => toggle(position)}
                />
                <span className={styles.name}>
                  {translateIngredient(ingredient.name, language)}
                </span>
                {/* O espaço separa nome e medida para o leitor de tela: "Alho 2 dentes" */}
                {ingredient.measure ? (
                  <>
                    {' '}
                    <span className={styles.measure}>
                      {measureLabel(ingredient.measure, { servings, system })}
                    </span>
                  </>
                ) : null}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </Card>
  )
}
