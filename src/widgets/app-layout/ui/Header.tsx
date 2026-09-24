import { ChefHat } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { LanguageSwitcher } from '@/features/language-switcher'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink } from '@/shared/ui'
import { navItems } from '../model/navItems'
import styles from './Header.module.scss'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <ChefHat size={22} aria-hidden="true" />
          {t('common.appName')}
        </Link>

        <nav className={styles.nav} aria-label={t('nav.label')}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher />
          <ButtonLink to="/">{t('nav.startCooking')}</ButtonLink>
        </div>
      </div>
    </header>
  )
}
