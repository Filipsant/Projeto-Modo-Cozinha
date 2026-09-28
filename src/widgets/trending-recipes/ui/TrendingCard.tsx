import { MousePointerClick } from 'lucide-react'
import { Link } from 'react-router'
import { illustrationFor, useDurationLabel } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { FoodIllustration } from '@/shared/ui'
import type { TrendingItem } from '../lib/buildTrending'
import styles from './TrendingRecipes.module.scss'

// Um degradê por família de prato: o trilho fica colorido, e dá para achar as
// sobremesas ou os peixes de relance. A ilustração branca vai por cima
const POSTER_COLORS: Record<string, [string, string]> = {
  Pasta: ['#e8a14b', '#a44a1c'],
  Beef: ['#c8505a', '#6e1c38'],
  Lamb: ['#c8505a', '#6e1c38'],
  Goat: ['#c8505a', '#6e1c38'],
  Pork: ['#d0707a', '#7f2d4f'],
  Chicken: ['#e0a35a', '#91531c'],
  Seafood: ['#3e8fb0', '#1c4a75'],
  Dessert: ['#d9779f', '#823768'],
  Vegetarian: ['#5fae7b', '#27644a'],
  Vegan: ['#5fae7b', '#27644a'],
  Breakfast: ['#e8b04a', '#a0661a'],
}

const BRAND_POSTER: [string, string] = ['#9680e5', '#482d85']

interface TrendingCardProps {
  item: TrendingItem
  /** Cliques da primeira colocada: a barra de cada cartão é proporcional a ela. */
  maxClicks: number
}

export function TrendingCard({ item, maxClicks }: TrendingCardProps) {
  const { t, i18n } = useTranslation()
  const durationLabel = useDurationLabel()
  const { recipe, clicks, rank } = item
  const [from, to] = POSTER_COLORS[recipe.category ?? ''] ?? BRAND_POSTER
  const details = [
    recipe.category ? t(`categories.${recipe.category}`, recipe.category) : null,
    durationLabel(recipe.estimatedMinutes),
  ].filter(Boolean)

  return (
    <li className={styles.item}>
      <Link
        to={`/receita/${recipe.id}`}
        className={styles.card}
        aria-label={
          rank
            ? t('trending.cardLabel', { rank, name: recipe.name, count: clicks })
            : t('trending.cardSuggestionLabel', { name: recipe.name })
        }
      >
        <span
          className={styles.poster}
          style={{ backgroundImage: `linear-gradient(160deg, ${from}, ${to})` }}
        >
          <FoodIllustration
            name={illustrationFor(recipe)}
            className={styles.art}
            strokeWidth={2.2}
          />

          {rank ? (
            <span className={styles.rank}>{String(rank).padStart(2, '0')}</span>
          ) : (
            <span className={styles.suggestion}>{t('trending.suggestion')}</span>
          )}

          {clicks > 0 ? (
            <span className={styles.clicks}>
              <MousePointerClick size={14} aria-hidden="true" />
              <span className={styles.bar}>
                <span style={{ width: `${Math.round((clicks / maxClicks) * 100)}%` }} />
              </span>
              <span className={styles.clicksCount}>
                {new Intl.NumberFormat(i18n.resolvedLanguage).format(clicks)}
              </span>
            </span>
          ) : null}
        </span>

        <span className={styles.name}>{recipe.name}</span>
        <span className={styles.details}>{details.join(' · ')}</span>
      </Link>
    </li>
  )
}
