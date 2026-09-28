import { useTranslation } from '@/shared/i18n'
import { splitDuration } from '../lib/estimateCookTime'

/**
 * "20 min", ou "1 h 30 min" acima de uma hora, porque "570 min" ninguém lê de relance.
 * Serve tanto para a estimativa da receita quanto para o tempo que o passo cita.
 */
export function useDurationLabel() {
  const { t } = useTranslation()

  return (totalMinutes: number) => {
    const { hours, minutes } = splitDuration(totalMinutes)

    if (hours === 0) return t('common.minutesShort', { count: minutes })
    if (minutes === 0) return t('common.hours', { hours })

    return t('common.hoursMinutes', { hours, minutes })
  }
}
