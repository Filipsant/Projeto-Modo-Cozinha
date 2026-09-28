import { ArrowRight, Heart, SearchX } from 'lucide-react'
import { RecipeCard } from '@/entities/recipe'
import { FavoriteButton, type FavoriteRecipe } from '@/features/favorite-recipe'
import { useTranslation } from '@/shared/i18n'
import { Button, ButtonLink, EmptyState } from '@/shared/ui'
import styles from './FavoriteRecipes.module.scss'

interface FavoriteRecipesProps {
  /** Já filtradas e ordenadas pela página. */
  recipes: FavoriteRecipe[]
  /** Diferencia "ainda não salvou nada" de "a busca não achou". */
  hasFavorites: boolean
  onShowAll: () => void
}

export function FavoriteRecipes({ recipes, hasFavorites, onShowAll }: FavoriteRecipesProps) {
  const { t } = useTranslation()

  if (!hasFavorites) {
    return (
      <EmptyState
        icon={<Heart size={28} />}
        title={t('favorites.emptyTitle')}
        description={t('favorites.emptyDescription')}
        action={
          <ButtonLink to="/" icon={<ArrowRight size={18} aria-hidden="true" />}>
            {t('favorites.emptyAction')}
          </ButtonLink>
        }
      />
    )
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={28} />}
        title={t('favorites.noMatchesTitle')}
        description={t('favorites.noMatchesDescription')}
        action={
          <Button variant="secondary" onClick={onShowAll}>
            {t('favorites.noMatchesAction')}
          </Button>
        }
      />
    )
  }

  return (
    <ul className={styles.grid} role="list">
      {recipes.map((recipe) => (
        <li key={recipe.id} className={styles.item}>
          <RecipeCard recipe={recipe} actions={<FavoriteButton recipe={recipe} />} />
        </li>
      ))}
    </ul>
  )
}
