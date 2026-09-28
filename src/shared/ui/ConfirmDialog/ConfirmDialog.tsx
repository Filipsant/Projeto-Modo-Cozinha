import { TriangleAlert } from 'lucide-react'
import { useId, useRef } from 'react'
import { Button } from '../Button/Button'
import { Dialog } from '../Dialog/Dialog'
import styles from './ConfirmDialog.module.scss'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

// O "Diálogo de Confirmação" do design system, para ações que não dá para
// desfazer. O foco começa no Cancelar: um Enter distraído não apaga nada.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      role="alertdialog"
      labelledBy={titleId}
      describedBy={descriptionId}
      initialFocus={cancelRef}
    >
      <h2 id={titleId} className={styles.title}>
        <TriangleAlert size={20} aria-hidden="true" />
        {title}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>

      <div className={styles.actions}>
        <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button className={styles.confirm} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  )
}
