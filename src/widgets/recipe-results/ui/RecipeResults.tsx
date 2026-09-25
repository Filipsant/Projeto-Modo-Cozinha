import { SearchX } from 'lucide-react'
import { RecipeCard, type Recipe } from '@/entities/recipe'
import { FavoriteButton } from '@/features/favorite-recipe'
import { useTranslation } from '@/shared/i18n'
import { EmptyState, ErrorMessage, SkeletonCard } from '@/shared/ui'
import styles from './RecipeResults.module.scss'

const SKELETON_COUNT = 8

interface RecipeResultsProps {
  recipes: Recipe[] | undefined
  isPending: boolean
  isError: boolean
  onRetry: () => void
  onClearSearch: () => void
}

// Um lugar só para os três estados da busca: carregando, erro e vazio (RF03).
export function RecipeResults({
  recipes,
  isPending,
  isError,
  onRetry,
  onClearSearch,
}: RecipeResultsProps) {
  const { t } = useTranslation()

  if (isError) {
    return (
      <ErrorMessage
        title={t('home.errorTitle')}
        description={t('home.errorDescription')}
        onRetry={onRetry}
      />
    )
  }

  if (isPending) {
    return (
      <>
        <p className={styles.status} role="status">
          {t('common.loading')}
        </p>
        <div className={styles.grid} aria-hidden="true">
          {Array.from({ length: SKELETON_COUNT }, (_, position) => (
            <SkeletonCard key={position} />
          ))}
        </div>
      </>
    )
  }

  if (!recipes || recipes.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={28} />}
        title={t('home.emptyTitle')}
        description={t('home.emptyDescription')}
        action={
          <button type="button" className={styles.clear} onClick={onClearSearch}>
            {t('home.emptyAction')}
          </button>
        }
      />
    )
  }

  // A contagem fica no cabeçalho da página, ao lado do título
  return (
    <div className={styles.grid}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          // Na home todos os cartões têm o botão roxo cheio, como no design da home
          highlighted
          actions={<FavoriteButton recipe={recipe} />}
        />
      ))}
    </div>
  )
}
