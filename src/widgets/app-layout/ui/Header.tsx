import { ChefHat } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { LanguageSwitcher } from '@/features/language-switcher'
import { usePendingCount } from '@/features/shopping-list'
import { ThemeToggle } from '@/features/theme-switcher'
import { useTranslation } from '@/shared/i18n'
import { navItems } from '../model/navItems'
import { ConnectionStatus } from './ConnectionStatus'
import styles from './Header.module.scss'

export function Header() {
  const { t } = useTranslation()
  const pending = usePendingCount()

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
              {item.to === '/lista-de-compras' && pending > 0 ? (
                <span className={styles.badge}>
                  <span aria-hidden="true">{pending}</span>
                  {/* O leitor de tela ouve "Lista de compras, 7 itens pendentes", e não só "7" */}
                  <span className={styles.visuallyHidden}>
                    , {t('shopping.pendingInNav', { count: pending })}
                  </span>
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <ConnectionStatus />
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
