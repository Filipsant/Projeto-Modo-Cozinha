import { Share2 } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { shareContent, useTimedNotice } from '@/shared/lib'
import { IconButton, Toast } from '@/shared/ui'
import styles from './ShareButton.module.scss'

interface ShareButtonProps {
  title: string
}

// No celular abre o menu de compartilhar do sistema. Onde ele não existe,
// copia o link e avisa que copiou.
export function ShareButton({ title }: ShareButtonProps) {
  const { t } = useTranslation()
  const [notice, showNotice, dismissNotice] = useTimedNotice()

  async function share() {
    const result = await shareContent({ title, url: window.location.href })

    if (result === 'copied') showNotice(t('recipeDetails.linkCopied'))
    if (result === 'failed') showNotice(t('recipeDetails.shareFailed'))
  }

  return (
    <>
      <IconButton variant="surface" label={t('recipeDetails.share')} onClick={() => void share()}>
        <Share2 size={18} aria-hidden="true" />
      </IconButton>

      {notice ? (
        <div className={styles.notice}>
          <Toast message={notice} onDismiss={dismissNotice} />
        </div>
      ) : null}
    </>
  )
}
