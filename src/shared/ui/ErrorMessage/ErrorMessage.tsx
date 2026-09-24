import { RotateCcw, TriangleAlert } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { Button } from '../Button/Button'
import styles from './ErrorMessage.module.scss'

interface ErrorMessageProps {
  title?: string
  description?: string
  /** Quando existe, mostra o botão "Tentar de novo" (RNF14). */
  onRetry?: () => void
}

export function ErrorMessage({ title, description, onRetry }: ErrorMessageProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.error} role="alert">
      <TriangleAlert size={20} className={styles.icon} aria-hidden="true" />

      <div className={styles.text}>
        <p className={styles.title}>{title ?? t('common.somethingWentWrong')}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {onRetry ? (
        <Button
          variant="secondary"
          onClick={onRetry}
          icon={<RotateCcw size={16} aria-hidden="true" />}
        >
          {t('common.retry')}
        </Button>
      ) : null}
    </div>
  )
}
