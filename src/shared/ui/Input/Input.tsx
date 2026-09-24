import { X } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { IconButton } from '../IconButton/IconButton'
import styles from './Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelVisible?: boolean
  icon?: ReactNode
  onClear?: () => void
}

export function Input({
  label,
  labelVisible = true,
  icon,
  onClear,
  className,
  id,
  value,
  type = 'text',
  ...rest
}: InputProps) {
  const { t } = useTranslation()
  const generateId = useId()
  const inputId = id ?? generateId
  const showClear = Boolean(onClear) && String(value ?? '').length > 0

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={labelVisible ? styles.label : styles.labelHidden}>
        {label}
      </label>

      <div className={styles.control}>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}

        <input
          id={inputId}
          type={type}
          value={value}
          className={[styles.input, icon ? styles.inputWithIcon : null].filter(Boolean).join(' ')}
          {...rest}
        />

        {showClear ? (
          <IconButton
            label={t('common.clear', { field: label.toLowerCase() })}
            className={styles.clear}
            onClick={onClear}
          >
            <X size={18} aria-hidden="true" />
          </IconButton>
        ) : null}
      </div>
    </div>
  )
}
