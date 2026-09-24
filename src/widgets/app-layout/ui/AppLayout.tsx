import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './AppLayout.module.scss'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo" className={styles.content} tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
