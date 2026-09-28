import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '@/shared/i18n'
import styles from './Toast.module.scss'

interface ToastProps {
  /** Linha em negrito acima da mensagem, como o "Sucesso" do design system. */
  title?: string
  message: string
  /** success e error trazem o círculo verde com ✓ ou o vermelho com ×, como no design. */
  tone?: 'neutral' | 'success' | 'error'
  /** Ícone decorativo à esquerda, como o "i" do aviso de remoção no design. */
  icon?: ReactNode
  /** Rótulo da ação, como "Desfazer". Precisa vir junto de onAction. */
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

// Segue o tema: branco com sombra no claro e o #1e222d do design no escuro.
// A sombra destaca o aviso de qualquer tela sem competir com o roxo das ações.
// Sem temporizador de propósito: quem decide quanto tempo o aviso fica na tela é
// quem o usa. O "Desfazer" dos favoritos precisa de 5 segundos; outros avisos, não.
export function Toast({
  title,
  message,
  tone = 'neutral',
  icon,
  actionLabel,
  onAction,
  onDismiss,
}: ToastProps) {
  const { t } = useTranslation()
  const badge =
    tone === 'neutral' ? null : (
      <span className={`${styles.badge} ${styles[tone]}`}>
        {tone === 'success' ? <Check size={16} strokeWidth={3} /> : <X size={16} strokeWidth={3} />}
      </span>
    )

  return (
    <div className={title ? `${styles.toast} ${styles.withTitle}` : styles.toast} role="status">
      {badge || icon ? (
        <span className={styles.icon} aria-hidden="true">
          {badge ?? icon}
        </span>
      ) : null}

      <div className={styles.text}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <p className={styles.message}>{message}</p>
      </div>

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
