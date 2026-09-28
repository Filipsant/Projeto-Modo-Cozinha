import { useEffect, useEffectEvent, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import styles from './Dialog.module.scss'

const FOCUSABLE = [
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface DialogProps {
  open: boolean
  onClose: () => void
  /** id do título: é o nome que o leitor de tela anuncia. */
  labelledBy: string
  describedBy?: string
  /** alertdialog para ações sem volta, como esvaziar a lista. */
  role?: 'dialog' | 'alertdialog'
  /** Quem recebe o foco ao abrir. Sem ele, o primeiro botão ou campo do diálogo. */
  initialFocus?: RefObject<HTMLElement | null>
  className?: string
  children: ReactNode
}

// A base dos diálogos do app: fundo escuro, Esc e clique fora fecham, e o Tab
// circula só dentro dele. Feito à mão porque o jsdom dos testes não tem showModal()
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  role = 'dialog',
  initialFocus,
  className,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  // Evento, e não dependência: marcar uma caixa dentro do diálogo renderiza quem o
  // usa de novo, e o foco não pode pular para o começo a cada marcação
  const close = useEffectEvent(onClose)

  useEffect(() => {
    if (!open) return

    // Quem abriu o diálogo recebe o foco de volta quando ele fecha
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(initialFocus?.current ?? first)?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }

      if (event.key === 'Tab') {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)

        if (!items || items.length === 0) return

        const firstItem = items[0]
        const lastItem = items[items.length - 1]

        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault()
          lastItem.focus()
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault()
          firstItem.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
  }, [open, initialFocus])

  if (!open) return null

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        className={[styles.dialog, className].filter(Boolean).join(' ')}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        // Clique dentro do diálogo não fecha; só no fundo escuro
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
