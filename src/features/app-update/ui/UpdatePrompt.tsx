import { RefreshCw } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { Toast } from '@/shared/ui'
import { usePwaStore } from '../model/pwaStore'
import styles from './UpdatePrompt.module.scss'

// A versão nova só entra quando a pessoa toca em "Atualizar": recarregar sozinho
// no meio de uma receita perderia o passo e os timers.
export function UpdatePrompt() {
  const { t } = useTranslation()
  const applyUpdate = usePwaStore((state) => state.applyUpdate)
  const dismissUpdate = usePwaStore((state) => state.dismissUpdate)

  if (!applyUpdate) return null

  return (
    <div className={styles.region}>
      <Toast
        icon={<RefreshCw size={18} />}
        message={t('pwa.updateAvailable')}
        actionLabel={t('pwa.update')}
        onAction={applyUpdate}
        onDismiss={dismissUpdate}
      />
    </div>
  )
}
