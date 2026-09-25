import { ArrowLeft, PartyPopper, Search } from 'lucide-react'
import type { Recipe } from '@/entities/recipe'
import { FavoriteButton } from '@/features/favorite-recipe'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, Card } from '@/shared/ui'
import styles from './CookingSession.module.scss'

interface CookingDoneProps {
  recipe: Recipe
  recipeLink: string
}

// Depois do último passo: parabéns, e o convite para salvar a receita
export function CookingDone({ recipe, recipeLink }: CookingDoneProps) {
  const { t } = useTranslation()

  return (
    <Card className={styles.done}>
      <span className={styles.doneIcon} aria-hidden="true">
        <PartyPopper size={36} />
      </span>
      <h2 className={styles.doneTitle}>{t('cooking.doneTitle')}</h2>
      <p className={styles.doneText}>{t('cooking.doneDescription')}</p>

      <div className={styles.doneActions}>
        <FavoriteButton recipe={recipe} />
        <ButtonLink
          to={recipeLink}
          variant="secondary"
          icon={<ArrowLeft size={18} aria-hidden="true" />}
        >
          {t('cooking.back')}
        </ButtonLink>
        <ButtonLink to="/" icon={<Search size={18} aria-hidden="true" />}>
          {t('cooking.exploreMore')}
        </ButtonLink>
      </div>
    </Card>
  )
}
