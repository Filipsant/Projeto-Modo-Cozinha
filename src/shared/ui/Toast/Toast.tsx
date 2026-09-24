import { X } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'
import styles from './Toast.module.scss'

interface ToastProps {
  message: string
  /** Rótulo da ação, como "Desfazer". Precisa vir junto de onAction. */
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

// Sem temporizador de propósito: quem decide quanto tempo o aviso fica na tela é
// quem o usa. O "Desfazer" dos favoritos precisa de 5 segundos; outros avisos, não.
export function Toast({ message, actionLabel, onAction, onDismiss }: ToastProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.toast} role="status">
      <p className={styles.message}>{message}</p>

      {actionLabel && onAction ? (
        <Button variant="ghost" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}

      {onDismiss ? (
        <IconButton label={t('common.closeNotice')} onClick={onDismiss}>
          <X size={18} aria-hidden="true" />
        </IconButton>
      ) : null}
    </div>
  )
}
