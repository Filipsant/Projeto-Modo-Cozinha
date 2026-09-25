import { useId, type ReactNode } from 'react'
import styles from './Callout.module.scss'

interface CalloutProps {
  /** Ícone decorativo, dentro do círculo roxo. */
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
}

// A "Dica de Bancada" do design: caixa cinza com ícone, título e um texto curto.
// É um aside porque complementa a tela sem fazer parte do conteúdo principal.
export function Callout({ icon, title, children, className }: CalloutProps) {
  const titleId = useId()

  return (
    <aside
      className={[styles.callout, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <div>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.text}>{children}</p>
      </div>
    </aside>
  )
}
