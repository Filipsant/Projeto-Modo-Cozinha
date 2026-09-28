import styles from './SkeletonText.module.scss'

interface SkeletonTextProps {
  /** Quantas linhas de texto o esqueleto imita; a última sai mais curta. */
  lines?: number
  className?: string
}

// Linhas pulsando no lugar de um texto que ainda está chegando. São <span> para
// caber dentro de um <p>, e ficam fora da leitura de tela
export function SkeletonText({ lines = 2, className }: SkeletonTextProps) {
  return (
    <span className={[styles.text, className].filter(Boolean).join(' ')} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          className={
            index === lines - 1 && lines > 1 ? `${styles.line} ${styles.last}` : styles.line
          }
        />
      ))}
    </span>
  )
}
