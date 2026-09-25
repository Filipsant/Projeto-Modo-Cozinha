import { ChefHat, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, Card } from '@/shared/ui'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeCard.module.scss'
import { useDurationLabel } from './useDurationLabel'

interface RecipeCardProps {
  recipe: Recipe
  /** Botões sobre a foto, como o coração. O card não sabe favoritar: quem sabe é a feature. */
  actions?: ReactNode
  /** Botão roxo cheio. Nos favoritos só o primeiro cartão tem, como no design. */
  highlighted?: boolean
}

// O cartão de receita da home e dos favoritos: foto com a origem, nome, tempo,
// ingredientes e dificuldade, e o botão de cozinhar
export function RecipeCard({ recipe, actions, highlighted = false }: RecipeCardProps) {
  const { t } = useTranslation()
  const durationLabel = useDurationLabel()
  // Favorita antiga pode chegar sem detalhes: aí tempo e dificuldade ficam de fora
  const hasDetails = recipe.steps.length > 0

  return (
    <Card className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.photo}
          src={`${recipe.thumbnail}/medium`}
          alt=""
          width={500}
          height={281}
          loading="lazy"
        />

        {recipe.area ? (
          <span className={styles.origin}>{t(`areas.${recipe.area}`, recipe.area)}</span>
        ) : null}

        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>

      <div className={styles.heading}>
        <h3 className={styles.name}>
          <Link to={`/receita/${recipe.id}`} className={styles.nameLink}>
            {recipe.name}
          </Link>
        </h3>

        {hasDetails ? (
          <span className={styles.time}>
            <Timer size={16} aria-hidden="true" />
            {durationLabel(recipe.estimatedMinutes, { estimated: true })}
          </span>
        ) : null}
      </div>

      {hasDetails ? (
        <p className={styles.meta}>
          <span>{t('common.ingredients', { count: recipe.ingredients.length })}</span>
          <span aria-hidden="true">•</span>
          <span>{t(`recipe.difficulty_${recipe.difficulty}`)}</span>
        </p>
      ) : null}

      <ButtonLink
        to={`/receita/${recipe.id}/cozinhar`}
        variant={highlighted ? 'primary' : 'secondary'}
        className={styles.cook}
        icon={<ChefHat size={18} aria-hidden="true" />}
      >
        {t('recipe.cookNow')}
      </ButtonLink>
    </Card>
  )
}
