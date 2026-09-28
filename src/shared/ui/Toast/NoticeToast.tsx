import { useEffect } from 'react'
import styles from './NoticeToast.module.scss'
import { useNoticeStore } from './noticeStore'
import { Toast } from './Toast'

/** Tempo na tela: dá para ler título e mensagem sem pressa. */
export const NOTICE_MS = 5000

// Fica no layout e mostra o que showNotice() pediu, no canto superior direito
export function NoticeToast() {
  const notice = useNoticeStore((state) => state.notice)
  const dismiss = useNoticeStore((state) => state.dismiss)

  useEffect(() => {
    if (!notice) return

    const timer = window.setTimeout(dismiss, NOTICE_MS)

    return () => window.clearTimeout(timer)
  }, [notice, dismiss])

  if (!notice) return null

  return (
    <div className={styles.region}>
      <Toast
        key={notice.id}
        tone={notice.tone}
        title={notice.title}
        message={notice.message}
        onDismiss={dismiss}
      />
    </div>
  )
}
