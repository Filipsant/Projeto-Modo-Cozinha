import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { formatClock, useNow } from '@/shared/lib'
import { Card } from '@/shared/ui'
import { createTimer, remainingMs, timerStatus } from '../lib/timer'
import { timerKey, useTimersStore } from '../model/timersStore'
import styles from './StepTimer.module.scss'

interface StepTimerProps {
  recipeId: string
  step: number
  /** O tempo que o texto do passo cita. */
  minutes: number
}

export function StepTimer({ recipeId, step, minutes }: StepTimerProps) {
  const { t } = useTranslation()
  const key = timerKey(recipeId, step)
  const durationMs = minutes * 60_000
  const timer = useTimersStore((state) => state.timers[key]) ?? createTimer(durationMs)
  const toggle = useTimersStore((state) => state.toggle)
  const reset = useTimersStore((state) => state.reset)
  // Atualiza 4 vezes por segundo só enquanto conta: o relógio não "pula" segundos
  const now = useNow(250, timer.endsAt !== null)
  const status = timerStatus(timer, now)
  const running = status === 'running'

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          <TimerIcon size={20} />
        </span>
        <div className={styles.heading}>
          <h2 className={styles.title}>{t('cooking.timerTitle')}</h2>
          <p className={styles.subtitle}>{t('cooking.timerSubtitle')}</p>
        </div>
        {/* Anuncia "Contando", "Pausado", "Tempo esgotado" quando muda */}
        <span className={`${styles.status} ${styles[status]}`} role="status">
          {t(`cooking.timerStatus_${status}`)}
        </span>
      </div>

      <div className={styles.panel}>
        <div>
          {/* role=timer não é lido a cada segundo: o leitor de tela não fica falando sem parar */}
          <p className={styles.clock} role="timer">
            {formatClock(remainingMs(timer, now))}
          </p>
          <p className={styles.caption}>{t('cooking.timerRecommended')}</p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.reset}
            aria-label={t('cooking.timerReset')}
            title={t('cooking.timerReset')}
            disabled={status === 'idle'}
            onClick={() => reset(key, durationMs)}
          >
            <RotateCcw size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.play}
            aria-label={running ? t('cooking.timerPause') : t('cooking.timerStart')}
            title={running ? t('cooking.timerPause') : t('cooking.timerStart')}
            onClick={() => toggle(key, durationMs)}
          >
            {running ? (
              <Pause size={26} aria-hidden="true" fill="currentColor" />
            ) : (
              <Play size={26} aria-hidden="true" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </Card>
  )
}
