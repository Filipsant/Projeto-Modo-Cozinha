import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: ação principal. secondary: ação de apoio. ghost: ação discreta. */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** md: 48 px do app. cooking: 64 px do modo cozinha, para mãos molhadas. */
  size?: 'md' | 'cooking'
  loading?: boolean
  /** Ícone decorativo à esquerda; quem descreve a ação é o texto do botão. */
  icon?: ReactNode
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'cooking' ? styles.cooking : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      {children}
    </button>
  )
}
