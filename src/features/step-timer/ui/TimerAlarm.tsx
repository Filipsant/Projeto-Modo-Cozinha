import { BellRing } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from '@/shared/i18n'
import { playAlarm, useNow } from '@/shared/lib'
import { Toast } from '@/shared/ui'
import { useHasRunningTimer, useTimersStore } from '../model/timersStore'
import styles from './TimerAlarm.module.scss'

interface TimerAlarmProps {
  /** Leva ao passo do timer que tocou. */
  onGoToStep: (step: number) => void
}

// Um vigia só para todos os timers: o do passo 3 toca mesmo com a pessoa já no passo 5.
export function TimerAlarm({ onGoToStep }: TimerAlarmProps) {
  const { t } = useTranslation()
  const running = useHasRunningTimer()
  const collectFinished = useTimersStore((state) => state.collectFinished)
  const dismissRinging = useTimersStore((state) => state.dismissRinging)
  const nextKey = useTimersStore((state) => state.ringing[0])
  const now = useNow(500, running)

  // Só avisa o store; a fila de avisos mora lá, e o toque de som sai daqui
  useEffect(() => {
    if (collectFinished(now).length > 0) playAlarm()
  }, [now, collectFinished])

  if (!nextKey) return null

  const step = Number(nextKey.split(':').at(-1))

  return (
    <div className={styles.region}>
      <Toast
        icon={<BellRing size={18} />}
        message={t('cooking.timerFinished', { number: step })}
        actionLabel={t('cooking.goToStep')}
        onAction={() => {
          onGoToStep(step)
          dismissRinging()
        }}
        onDismiss={dismissRinging}
      />
    </div>
  )
}
