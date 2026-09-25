import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/shared/i18n'
import styles from './Toast.module.scss'

interface ToastProps {
  message: string
  /** Ícone decorativo à esquerda, como o "i" do aviso de remoção no design. */
  icon?: ReactNode
  /** Rótulo da ação, como "Desfazer". Precisa vir junto de onAction. */
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

// Fundo escuro no tema claro e claro no escuro, como no design system: o aviso
// se destaca de qualquer tela sem competir com o roxo das ações.
// Sem temporizador de propósito: quem decide quanto tempo o aviso fica na tela é
// quem o usa. O "Desfazer" dos favoritos precisa de 5 segundos; outros avisos, não.
export function Toast({ message, icon, actionLabel, onAction, onDismiss }: ToastProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.toast} role="status">
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}

      <p className={styles.message}>{message}</p>

      {actionLabel && onAction ? (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}

      {onDismiss ? (
        <button
          type="button"
          className={styles.dismiss}
          aria-label={t('common.closeNotice')}
          title={t('common.closeNotice')}
          onClick={onDismiss}
        >
          <X size={18} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
