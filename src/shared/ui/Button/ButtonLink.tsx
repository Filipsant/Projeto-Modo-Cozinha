import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import styles from './Button.module.scss'

interface ButtonLinkProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'cooking'
  icon?: ReactNode
  children: ReactNode
}

// Mesmo visual do Button, mas navega. Quem leva para outra tela é link, não botão:
// o leitor de tela anuncia "link" e o usuário consegue abrir em outra aba.
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'cooking' ? styles.cooking : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link className={classes} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
