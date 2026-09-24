import { useTranslation } from '@/shared/i18n'
import styles from './Footer.module.scss'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer}>
      <p>
        {t('footer.credit')}{' '}
        <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">
          TheMealDB
        </a>
      </p>
      <p className={styles.tagline}>{t('footer.tagline')}</p>
    </footer>
  )
}
