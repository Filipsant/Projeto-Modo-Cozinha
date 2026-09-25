import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import styles from './StepNavigation.module.scss'

interface StepNavigationProps {
  step: number
  total: number
  onChange: (step: number) => void
}

export function StepNavigation({ step, total, onChange }: StepNavigationProps) {
  const { t } = useTranslation()
  const isFirst = step <= 1
  const isLast = step >= total

  // No notebook na bancada, as setas trocam de passo sem precisar mirar no botão
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select')) {
        return
      }

      if (event.key === 'ArrowRight' && step <= total) onChange(step + 1)
      if (event.key === 'ArrowLeft' && step > 1) onChange(step - 1)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [step, total, onChange])

  return (
    <nav className={styles.bar} aria-label={t('cooking.stepNavigation')}>
      <div className={styles.inner}>
        <Button
          variant="secondary"
          size="cooking"
          className={styles.previous}
          disabled={isFirst}
          icon={<ArrowLeft size={24} aria-hidden="true" />}
          onClick={() => onChange(step - 1)}
        >
          {t('cooking.previous')}
        </Button>

        <Button
          size="cooking"
          className={styles.next}
          onClick={() => onChange(step + 1)}
          icon={isLast ? <Check size={24} aria-hidden="true" /> : undefined}
        >
          {isLast ? t('cooking.finish') : t('cooking.next')}
          {isLast ? null : <ArrowRight size={24} aria-hidden="true" />}
        </Button>
      </div>
    </nav>
  )
}
