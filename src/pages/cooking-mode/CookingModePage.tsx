import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { recipeQueries } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, EmptyState, ErrorMessage, Spinner } from '@/shared/ui'
import { CookingSession } from '@/widgets/cooking-session'
import styles from './CookingModePage.module.scss'

// Fora do AppLayout: aqui não há cabeçalho nem rodapé, então a página cuida
// do próprio título e do <main> nos estados de carregando, erro e vazio.
export function CookingModePage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { data: recipe, isPending, isError, refetch } = useQuery(recipeQueries.detail(id))

  if (recipe) return <CookingSession recipe={recipe} />

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t('cooking.title')}</h1>

      {isError ? (
        <ErrorMessage
          title={t('recipeDetails.errorTitle')}
          description={t('recipeDetails.errorDescription')}
          onRetry={() => void refetch()}
        />
      ) : isPending ? (
        <Spinner label={t('common.loading')} />
      ) : (
        <EmptyState
          icon={<SearchX size={28} />}
          title={t('recipeDetails.notFoundTitle')}
          description={t('recipeDetails.notFoundDescription')}
          action={
            <ButtonLink
              to="/"
              variant="secondary"
              icon={<ArrowLeft size={18} aria-hidden="true" />}
            >
              {t('recipeDetails.backToRecipes')}
            </ButtonLink>
          }
        />
      )}
    </main>
  )
}
