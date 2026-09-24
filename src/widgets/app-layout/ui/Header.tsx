import { Link, NavLink } from 'react-router'
import { ButtonLink } from '@/shared/ui'
import { navItems } from '../model/navItems'
import styles from './Header.module.scss'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Modo Cozinha
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ButtonLink to="/" className={styles.cta}>
          Iniciar Modo Cozinha
        </ButtonLink>
      </div>
    </header>
  )
}
