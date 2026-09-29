import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { recipeQueries } from '@/entities/recipe'
import { useTrackRecipeOpen } from '@/features/recipe-clicks'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, EmptyState, ErrorMessage } from '@/shared/ui'
import { RecipeDetails, RecipeDetailsSkeleton } from '@/widgets/recipe-details'

export function RecipeDetailsPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { data: recipe, isPending, isError, refetch } = useQuery(recipeQueries.detail(id))
  // Cada receita aberta conta um clique no ranking "Em alta na bancada"
  useTrackRecipeOpen(recipe?.id)

  if (isError) {
    return (
      <ErrorMessage
        title={t('recipeDetails.errorTitle')}
        description={t('recipeDetails.errorDescription')}
        onRetry={() => void refetch()}
      />
    )
  }

  if (isPending) {
    return <RecipeDetailsSkeleton />
  }

  // A API responde 200 com "meals": null quando o id não existe
  if (!recipe) {
    return (
      <EmptyState
        icon={<SearchX size={28} />}
        title={t('recipeDetails.notFoundTitle')}
        description={t('recipeDetails.notFoundDescription')}
        action={
          <ButtonLink to="/" variant="secondary" icon={<ArrowLeft size={18} aria-hidden="true" />}>
            {t('recipeDetails.backToRecipes')}
          </ButtonLink>
        }
      />
    )
  }

  return <RecipeDetails recipe={recipe} />
}
