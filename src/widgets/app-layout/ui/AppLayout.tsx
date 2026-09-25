import { Outlet } from 'react-router'
import { FavoritesUndoToast } from '@/features/favorite-recipe'
import { useTranslation } from '@/shared/i18n'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './AppLayout.module.scss'

export function AppLayout() {
  const { t } = useTranslation()

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#conteudo">
        {t('nav.skipToContent')}
      </a>

      <Header />

      <main id="conteudo" className={styles.content} tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />

      {/* No layout, e não no cartão: o aviso continua na tela depois que o cartão some */}
      <FavoritesUndoToast />
    </div>
  )
}
