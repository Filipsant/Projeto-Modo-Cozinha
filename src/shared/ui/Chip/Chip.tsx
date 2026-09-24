import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Chip.module.scss'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children: ReactNode
}

export function Chip({ selected = false, children, className, ...rest }: ChipProps) {
  const classes = [styles.chip, selected ? styles.selected : null, className]

    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} aria-pressed={selected} {...rest}>
      {children}
    </button>
  )
}
