import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Receitas da{' '}
        <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">
          TheMealDB
        </a>
      </p>
      <p className={styles.tagline}>Ergonomia culinária pensada para bancadas e mãos ocupadas.</p>
    </footer>
  )
}
