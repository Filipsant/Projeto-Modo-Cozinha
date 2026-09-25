import { Minus, Plus } from 'lucide-react'
import { MAX_SERVINGS, MIN_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { useServings } from '../model/useServings'
import styles from './ServingsStepper.module.scss'

interface ServingsStepperProps {
  /** id do título visível do cartão, que dá nome ao grupo. */
  labelledBy: string
}

export function ServingsStepper({ labelledBy }: ServingsStepperProps) {
  const { t } = useTranslation()
  const [servings, setServings] = useServings()

  return (
    <div className={styles.stepper} role="group" aria-labelledby={labelledBy}>
      <button
        type="button"
        className={styles.button}
        aria-label={t('servings.decrease')}
        disabled={servings <= MIN_SERVINGS}
        onClick={() => setServings(servings - 1)}
      >
        <Minus size={18} aria-hidden="true" />
      </button>

      {/* Anuncia "6 porções" a cada clique, para quem não vê o número mudar */}
      <output className={styles.value} aria-live="polite">
        {servings}
        <span className={styles.unit}>{t('common.servings', { count: servings })}</span>
      </output>

      <button
        type="button"
        className={`${styles.button} ${styles.increase}`}
        aria-label={t('servings.increase')}
        disabled={servings >= MAX_SERVINGS}
        onClick={() => setServings(servings + 1)}
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
