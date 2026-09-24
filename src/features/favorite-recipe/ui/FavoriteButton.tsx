import { Heart } from 'lucide-react'
import type { RecipeSummary } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { useFavoritesStore, useIsFavorite } from '../model/favoritesStore'
import styles from './FavoriteButton.module.scss'

interface FavoriteButtonProps {
  recipe: RecipeSummary
}

export function FavoriteButton({ recipe }: FavoriteButtonProps) {
  const { t } = useTranslation()
  const isFavorite = useIsFavorite(recipe.id)
  const toggle = useFavoritesStore((state) => state.toggle)

  return (
    <IconButton
      variant="surface"
      // aria-pressed diz o estado a quem não vê o coração preenchido (RF10)
      aria-pressed={isFavorite}
      label={isFavorite ? t('recipe.unfavorite') : t('recipe.favorite')}
      className={isFavorite ? styles.active : undefined}
      onClick={() => toggle(recipe)}
    >
      <Heart size={18} aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
    </IconButton>
  )
}
