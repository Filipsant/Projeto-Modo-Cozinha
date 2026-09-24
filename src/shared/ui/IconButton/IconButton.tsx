import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './IconButton.module.scss'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Obrigatório: como não há texto visível, é isto que o leitor de tela anuncia. */
  label: string
  /** ghost: sobre fundo comum. surface: círculo branco sobre a foto da receita. */
  variant?: 'ghost' | 'surface'
  children: ReactNode
}

export function IconButton({
  label,
  variant = 'ghost',
  children,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const classes = [styles.iconButton, styles[variant], className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  )
}
