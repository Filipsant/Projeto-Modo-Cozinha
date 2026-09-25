import { Eraser, MoreVertical, Share2, Trash2 } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { MeasureSystem } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { shareContent, useTimedNotice } from '@/shared/lib'
import { Button, ConfirmDialog, Toast } from '@/shared/ui'
import { useShoppingListStore } from '../model/shoppingListStore'
import { useShoppingListText } from '../model/useShoppingListText'
import styles from './ShoppingListActions.module.scss'

interface ShoppingListActionsProps {
  system: MeasureSystem
}

// "Compartilhar" e o "⋮" do design. O menu é um botão que abre e fecha uma
// lista de ações (padrão disclosure), e não um role="menu" com setas.
export function ShoppingListActions({ system }: ShoppingListActionsProps) {
  const { t } = useTranslation()
  const panelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [notice, showNotice, dismissNotice] = useTimedNotice()
  const buildText = useShoppingListText(system)
  const itemCount = useShoppingListStore((state) => state.items.length)
  const hasBought = useShoppingListStore((state) => state.items.some((item) => item.bought))
  const clearBought = useShoppingListStore((state) => state.clearBought)
  const clear = useShoppingListStore((state) => state.clear)

  // Fecha o menu com Esc ou com um clique fora dele
  useEffect(() => {
    if (!menuOpen) return

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  async function share() {
    const result = await shareContent({ title: t('shopping.shareTitle'), text: buildText() })

    if (result === 'copied') showNotice(t('shopping.copied'))
    if (result === 'failed') showNotice(t('shopping.shareFailed'))
  }

  return (
    <div className={styles.actions} ref={containerRef}>
      <Button
        className={styles.share}
        icon={<Share2 size={18} aria-hidden="true" />}
        onClick={() => void share()}
      >
        {t('shopping.share')}
      </Button>

      <button
        type="button"
        className={styles.more}
        aria-label={t('shopping.moreActions')}
        title={t('shopping.moreActions')}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <MoreVertical size={20} aria-hidden="true" />
      </button>

      <div id={panelId} className={styles.panel} hidden={!menuOpen}>
        <button
          type="button"
          className={styles.option}
          disabled={!hasBought}
          onClick={() => {
            clearBought()
            setMenuOpen(false)
          }}
        >
          <Eraser size={18} aria-hidden="true" />
          {t('shopping.clearBought')}
        </button>
        <button
          type="button"
          className={`${styles.option} ${styles.danger}`}
          onClick={() => {
            setMenuOpen(false)
            setConfirmOpen(true)
          }}
        >
          <Trash2 size={18} aria-hidden="true" />
          {t('shopping.clearAll')}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('shopping.confirmTitle')}
        description={t('shopping.confirmText', { count: itemCount })}
        confirmLabel={t('shopping.confirm')}
        cancelLabel={t('shopping.cancel')}
        onConfirm={() => {
          clear()
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {notice ? (
        <div className={styles.notice}>
          <Toast message={notice} onDismiss={dismissNotice} />
        </div>
      ) : null}
    </div>
  )
}
