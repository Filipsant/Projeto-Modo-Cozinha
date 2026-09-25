import { Bookmark, Heart } from 'lucide-react'
import type { Recipe } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { useFavoritesStore, useIsFavorite } from '../model/favoritesStore'
import styles from './FavoriteButton.module.scss'

interface FavoriteButtonProps {
  /** A receita inteira: a página de favoritos mostra tempo e dificuldade sem buscar de novo. */
  recipe: Recipe
  /** heart nos cartões; bookmark na barra do detalhe, como no design. */
  icon?: 'heart' | 'bookmark'
}

export function FavoriteButton({ recipe, icon = 'heart' }: FavoriteButtonProps) {
  const { t } = useTranslation()
  const isFavorite = useIsFavorite(recipe.id)
  const toggle = useFavoritesStore((state) => state.toggle)
  const Icon = icon === 'bookmark' ? Bookmark : Heart

  return (
    <IconButton
      variant="surface"
      // aria-pressed diz o estado a quem não vê o ícone preenchido (RF10)
      aria-pressed={isFavorite}
      label={isFavorite ? t('recipe.unfavorite') : t('recipe.favorite')}
      className={isFavorite ? styles.active : undefined}
      onClick={() => toggle(recipe)}
    >
      <Icon size={18} aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
    </IconButton>
  )
}
