import { Info } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Toast } from '@/shared/ui'
import { useFavoritesStore } from '../model/favoritesStore'
import styles from './FavoritesUndoToast.module.scss'

/** Tempo para desfazer, como pede o roadmap. */
export const UNDO_MS = 5000

// Fica no layout, e não no botão: na página de favoritos o cartão some junto com
// o botão, e o aviso precisa continuar na tela.
export function FavoritesUndoToast() {
  const { t } = useTranslation()
  const lastRemoved = useFavoritesStore((state) => state.lastRemoved)
  const undoRemove = useFavoritesStore((state) => state.undoRemove)
  const dismissUndo = useFavoritesStore((state) => state.dismissUndo)

  useEffect(() => {
    if (!lastRemoved) return

    const timer = window.setTimeout(dismissUndo, UNDO_MS)

    return () => window.clearTimeout(timer)
  }, [lastRemoved, dismissUndo])

  if (!lastRemoved) return null

  return (
    <div className={styles.region}>
      <Toast
        icon={<Info size={18} />}
        message={t('favorites.removed')}
        actionLabel={t('common.undo')}
        onAction={undoRemove}
        onDismiss={dismissUndo}
      />
    </div>
  )
}
