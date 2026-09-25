import { Hourglass, Pause, Play } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/shared/i18n'
import { formatClock, useNow } from '@/shared/lib'
import { Card } from '@/shared/ui'
import { createTimer, remainingMs, timerStatus } from '../lib/timer'
import { timerKey, useTimersStore } from '../model/timersStore'
import styles from './QuickTimer.module.scss'

interface QuickTimerProps {
  recipeId: string
  step: number
  minutes: number
  /** "Dispare 35 min do passo 4": quem usa monta o texto, com a duração já formatada. */
  description: ReactNode
}

// O "Cronômetro de Cozimento Rápido" do detalhe. Usa o mesmo timer do passo no
// modo cozinha: começar aqui e abrir o modo cozinha mostra o mesmo tempo correndo.
export function QuickTimer({ recipeId, step, minutes, description }: QuickTimerProps) {
  const { t } = useTranslation()
  const key = timerKey(recipeId, step)
  const durationMs = minutes * 60_000
  const timer = useTimersStore((state) => state.timers[key]) ?? createTimer(durationMs)
  const toggle = useTimersStore((state) => state.toggle)
  const now = useNow(250, timer.endsAt !== null)
  const running = timerStatus(timer, now) === 'running'

  return (
    <Card className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        <Hourglass size={20} />
      </span>
      <div className={styles.text}>
        <h2 className={styles.title}>{t('recipeDetails.quickTimerTitle')}</h2>
        <p className={styles.description}>{description}</p>
      </div>
      <p className={styles.clock} role="timer">
        {formatClock(remainingMs(timer, now))}
      </p>
      <button type="button" className={styles.button} onClick={() => toggle(key, durationMs)}>
        {running ? (
          <Pause size={16} aria-hidden="true" fill="currentColor" />
        ) : (
          <Play size={16} aria-hidden="true" fill="currentColor" />
        )}
        {running ? t('recipeDetails.quickTimerPause') : t('recipeDetails.quickTimerStart')}
      </button>
    </Card>
  )
}
