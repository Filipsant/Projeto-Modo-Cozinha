import { CloudCheck } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { usePwaStore } from '../model/pwaStore'
import styles from './OfflineReadyBadge.module.scss'

/** O selo "Pronto para cozinhar offline" do design; só aparece quando é verdade. */
export function OfflineReadyBadge() {
  const { t } = useTranslation()
  const offlineReady = usePwaStore((state) => state.offlineReady)

  if (!offlineReady) return null

  return (
    <span className={styles.badge}>
      <CloudCheck size={14} aria-hidden="true" />
      {t('pwa.offlineReady')}
    </span>
  )
}
