import { useId, type ReactNode } from 'react'
import styles from './SegmentedControl.module.scss'

interface SegmentedOption<Value extends string> {
  value: Value
  label: string
  /** Ícone decorativo antes do texto da opção. */
  icon?: ReactNode
}

interface SegmentedControlProps<Value extends string> {
  /** Texto visível à esquerda, que também dá nome ao grupo. */
  label: string
  /** Ícone decorativo antes do texto. */
  icon?: ReactNode
  options: SegmentedOption<Value>[]
  value: Value
  onChange: (value: Value) => void
  className?: string
}

// Rádios de verdade por baixo do visual de pílula: as setas do teclado trocam
// a opção e o leitor de tela anuncia "1 de 2, selecionado" sem código extra.
// É um radiogroup, e não fieldset com legend, porque o legend não aceita ficar
// na mesma linha das opções como no design.
export function SegmentedControl<Value extends string>({
  label,
  icon,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<Value>) {
  const labelId = useId()

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-labelledby={labelId}
    >
      <span id={labelId} className={styles.label}>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {label}
      </span>

      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              className={styles.radio}
              name={labelId}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.text}>
              {option.icon ? (
                <span className={styles.optionIcon} aria-hidden="true">
                  {option.icon}
                </span>
              ) : null}
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
