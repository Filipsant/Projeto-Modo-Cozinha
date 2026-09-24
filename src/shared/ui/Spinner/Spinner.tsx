import { useTranslation } from '@/shared/i18n'
import styles from './Spinner.module.scss'

interface SpinnerProps {
  /** O que o leitor de tela anuncia enquanto a espera dura. */
  label?: string
}

export function Spinner({ label }: SpinnerProps) {
  const { t } = useTranslation()

  return (
    <span className={styles.spinner} role="status">
      <span className={styles.circle} aria-hidden="true" />
      <span className={styles.label}>{label ?? t('common.loading')}</span>
    </span>
  )
}
