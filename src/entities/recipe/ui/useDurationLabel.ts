import { useTranslation } from '@/shared/i18n'
import { splitDuration } from '../lib/estimateCookTime'

/**
 * "~1 h 30 min" para estimativas nossas; "20 min" para o tempo que o passo cita.
 * Acima de uma hora mostra horas, porque "~570 min" ninguém lê de relance.
 */
export function useDurationLabel() {
  const { t } = useTranslation()

  return (totalMinutes: number, { estimated = false }: { estimated?: boolean } = {}) => {
    const { hours, minutes } = splitDuration(totalMinutes)

    if (hours === 0) {
      return estimated
        ? t('common.estimated', { count: minutes })
        : t('common.minutesShort', { count: minutes })
    }

    if (minutes === 0) {
      return estimated ? t('common.estimatedHours', { hours }) : t('common.hours', { hours })
    }

    return estimated
      ? t('common.estimatedHoursMinutes', { hours, minutes })
      : t('common.hoursMinutes', { hours, minutes })
  }
}
