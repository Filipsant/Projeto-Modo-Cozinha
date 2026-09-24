import { ChefHat, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, Card } from '@/shared/ui'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeCard.module.scss'

const MAIN_INGREDIENTS = 3

interface RecipeCardProps {
  recipe: Recipe
  /** Botões extras, como o favorito. O card não sabe favoritar: quem sabe é a feature. */
  actions?: ReactNode
}

export function RecipeCard({ recipe, actions }: RecipeCardProps) {
  const { t } = useTranslation()
  const main = recipe.ingredients.slice(0, MAIN_INGREDIENTS)
  const rest = recipe.ingredients.length - main.length

  return (
    <Card className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.photo}
          src={`${recipe.thumbnail}/preview`}
          alt=""
          width={640}
          height={360}
          loading="lazy"
        />

        <span className={styles.time}>
          <Timer size={14} aria-hidden="true" />
          {t('common.estimated', { count: recipe.estimatedMinutes })}
        </span>

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>

      <div className={styles.body}>
        <p className={styles.tags}>
          {recipe.category ? (
            <span className={`${styles.tag} ${styles.tagCategory}`}>
              {t(`categories.${recipe.category}`, recipe.category)}
            </span>
          ) : null}
          <span className={styles.tag}>{t(`recipe.difficulty_${recipe.difficulty}`)}</span>
          <span className={styles.tag}>{t('common.servings', { count: BASE_SERVINGS })}</span>
        </p>

        <h3 className={styles.name}>
          <Link to={`/receita/${recipe.id}`} className={styles.nameLink}>
            {recipe.name}
          </Link>
        </h3>

        {recipe.steps[0] ? <p className={styles.description}>{recipe.steps[0]}</p> : null}

        {main.length > 0 ? (
          <div className={styles.ingredients}>
            <span className={styles.ingredientsLabel}>{t('recipe.mainIngredients')}</span>
            <span className={styles.ingredientsList}>
              {main.map((ingredient) => (
                <span key={ingredient.name} className={styles.ingredient}>
                  {ingredient.name}
                </span>
              ))}
              {rest > 0 ? <span className={styles.ingredient}>+{rest}</span> : null}
            </span>
          </div>
        ) : null}

        <ButtonLink
          to={`/receita/${recipe.id}/cozinhar`}
          className={styles.cook}
          icon={<ChefHat size={18} aria-hidden="true" />}
        >
          {t('recipe.cookMode')}
        </ButtonLink>
      </div>
    </Card>
  )
}
