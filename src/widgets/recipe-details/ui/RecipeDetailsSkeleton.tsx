import { useTranslation } from '@/shared/i18n'
import styles from './RecipeDetails.module.scss'

// Mesmo desenho da tela pronta: quando a receita chega, nada pula de lugar
export function RecipeDetailsSkeleton() {
  const { t } = useTranslation()

  return (
    <div className={styles.page}>
      <p className={styles.status} role="status">
        {t('common.loading')}
      </p>

      <div className={styles.columns} aria-hidden="true">
        <div className={styles.aside}>
          <div className={`${styles.skeleton} ${styles.skeletonHero}`}></div>
          <div className={`${styles.skeleton} ${styles.skeletonBlock}`}></div>
        </div>
        <div className={styles.main}>
          <div className={`${styles.skeleton} ${styles.skeletonTall}`}></div>
          <div className={`${styles.skeleton} ${styles.skeletonBlock}`}></div>
        </div>
      </div>
    </div>
  )
}
