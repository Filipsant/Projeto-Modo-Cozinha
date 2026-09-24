import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: ação principal. secondary: ação de apoio. ghost: ação discreta. */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** md: 48 px do app. cooking: 64 px do modo cozinha, para mãos molhadas. */
  size?: 'md' | 'cooking'
  loading?: boolean
  /** Ocupa toda a largura disponível, como o botão no pé do cartão de receita. */
  fullWidth?: boolean
  /** Ícone decorativo à esquerda; quem descreve a ação é o texto do botão. */
  icon?: ReactNode
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
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
    fullWidth ? styles.fullWidth : null,
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
