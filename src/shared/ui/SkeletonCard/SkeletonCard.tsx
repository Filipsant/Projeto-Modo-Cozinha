import styles from './SkeletonCard.module.scss'

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image}></div>
      <div className={styles.line}></div>
      <div className={`${styles.line} ${styles.lineShort}`}></div>
    </div>
  )
}
