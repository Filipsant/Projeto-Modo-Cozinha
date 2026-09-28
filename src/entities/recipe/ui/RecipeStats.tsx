import { CookingPot, Flame, Timer } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Card } from '@/shared/ui'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeStats.module.scss'
import { useDurationLabel } from './useDurationLabel'

interface RecipeStatsProps {
  recipe: Recipe
}

export function RecipeStats({ recipe }: RecipeStatsProps) {
  const { t } = useTranslation()
  const durationLabel = useDurationLabel()
  const methods = recipe.methods.map((method) => t(`recipe.method_${method}`)).join(' + ')

  return (
    <Card className={styles.card}>
      <dl className={styles.stats}>
        <Stat
          icon={<Timer size={20} />}
          label={t('recipeDetails.totalTime')}
          value={durationLabel(recipe.estimatedMinutes)}
        />
        <Stat
          icon={<CookingPot size={20} />}
          label={t('recipeDetails.difficulty')}
          value={t(`recipe.difficulty_${recipe.difficulty}`)}
        />
        <Stat icon={<Flame size={20} />} label={t('recipeDetails.method')} value={methods} warm />
      </dl>
    </Card>
  )
}

interface StatProps {
  icon: ReactNode
  label: string
  value: string
  /** Ícone em laranja, como o do método no design. */
  warm?: boolean
}

function Stat({ icon, label, value, warm = false }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={warm ? `${styles.icon} ${styles.warm}` : styles.icon} aria-hidden="true">
        {icon}
      </span>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  )
}
