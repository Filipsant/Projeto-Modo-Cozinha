import { ChevronDown, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from '@/shared/i18n'
import styles from './Combobox.module.scss'

export interface ComboboxOption {
  value: string
  label: string
  /** Quantidade ao lado da opção, como o número de receitas. */
  count?: number
}

interface ComboboxProps {
  label: string
  options: ComboboxOption[]
  /** Valor escolhido; string vazia significa nenhum. */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

// Padrão ARIA de combobox: um input com role="combobox" comandando um listbox.
// Teclado: setas navegam, Enter escolhe, Esc fecha.
export function Combobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
}: ComboboxProps) {
  const { t } = useTranslation()
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = options.find((option) => option.value === value)
  const filtered = useMemo(() => {
    const term = normalize(query.trim())

    return term ? options.filter((option) => normalize(option.label).includes(term)) : options
  }, [options, query])

  // Clicar fora fecha a lista sem escolher nada
  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  function choose(option: ComboboxOption) {
    onChange(option.value)
    setQuery('')
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()

      if (!open) {
        setOpen(true)
        setActiveIndex(0)
        return
      }

      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && open) {
      const option = filtered[activeIndex]

      if (option) {
        event.preventDefault()
        choose(option)
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  const activeOptionId = open && filtered[activeIndex] ? `${id}-option-${activeIndex}` : undefined

  return (
    <div className={[styles.combobox, className].filter(Boolean).join(' ')} ref={rootRef}>
      <label htmlFor={`${id}-input`} className={styles.label}>
        {label}
      </label>

      <div className={styles.control}>
        <input
          id={`${id}-input`}
          className={styles.input}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          value={open ? query : (selected?.label ?? '')}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {value ? (
          <button
            type="button"
            className={styles.clear}
            aria-label={t('common.clear', { field: label.toLowerCase() })}
            onClick={() => {
              onChange('')
              setQuery('')
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : (
          <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
        )}
      </div>

      {open ? (
        <ul id={`${id}-listbox`} className={styles.list} role="listbox" aria-label={label}>
          {filtered.length === 0 ? (
            <li className={styles.empty}>{t('common.noResults')}</li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                className={
                  index === activeIndex ? `${styles.option} ${styles.active}` : styles.option
                }
                // pointerdown roubaria o foco do input antes de o clique acontecer
                onPointerDown={(event) => event.preventDefault()}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
                {option.count === undefined ? null : (
                  <span className={styles.count}>{option.count}</span>
                )}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
