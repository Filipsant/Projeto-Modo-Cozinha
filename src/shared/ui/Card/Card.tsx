import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.scss'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

// A superfície branca dos 30% da regra 60-30-10: cartão de receita, painel, módulo.
export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
