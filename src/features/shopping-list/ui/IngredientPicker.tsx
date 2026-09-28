import { ShoppingCart } from 'lucide-react'
import { useId, useState } from 'react'
import {
  translateIngredient,
  useMeasureLabel,
  type MeasureSystem,
  type Recipe,
} from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { Button, Dialog } from '@/shared/ui'
import { isShoppable } from '../lib/aisleOf'
import styles from './IngredientPicker.module.scss'

interface IngredientPickerProps {
  recipe: Recipe
  servings: number
  system: MeasureSystem
  /** Posições que já começam marcadas: todas, ou as que já estão na lista. */
  initialPositions: readonly number[]
  /** A receita já está na lista: o botão diz "Atualizar", e não "Adicionar". */
  inList: boolean
  onConfirm: (positions: number[]) => void
  onClose: () => void
}

// A pessoa desmarca o que já tem em casa, e só o resto vai para a lista.
// Quem usa monta o componente só quando o diálogo abre: cada abertura começa
// com as marcas de initialPositions
export function IngredientPicker({
  recipe,
  servings,
  system,
  initialPositions,
  inList,
  onConfirm,
  onClose,
}: IngredientPickerProps) {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const measureLabel = useMeasureLabel()
  const titleId = useId()
  const descriptionId = useId()
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set(initialPositions))

  // Água e gelo não entram na lista, então nem aparecem para escolher
  const options = recipe.ingredients
    .map((ingredient, position) => ({ ingredient, position }))
    .filter(({ ingredient }) => isShoppable(ingredient.name))
  const allSelected = selected.size === options.length

  function toggle(position: number) {
    setSelected((current) => {
      const next = new Set(current)

      if (!next.delete(position)) next.add(position)

      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(options.map(({ position }) => position)))
  }

  return (
    <Dialog
      open
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      className={styles.dialog}
    >
      <h2 id={titleId} className={styles.title}>
        <ShoppingCart size={20} className={styles.titleIcon} aria-hidden="true" />
        {t('shopping.pickTitle')}
      </h2>
      <p id={descriptionId} className={styles.description}>
        {t('shopping.pickDescription', { count: servings })}
      </p>

      <div className={styles.toolbar}>
        <span role="status">
          {t('shopping.pickCount', { selected: selected.size, total: options.length })}
        </span>
        <button type="button" className={styles.toggleAll} onClick={toggleAll}>
          {allSelected ? t('shopping.selectNone') : t('shopping.selectAll')}
        </button>
      </div>

      <ul className={styles.list} role="list">
        {options.map(({ ingredient, position }) => (
          <li key={position}>
            <label className={styles.row}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selected.has(position)}
                onChange={() => toggle(position)}
              />
              <span className={styles.name}>{translateIngredient(ingredient.name, language)}</span>
              {ingredient.measure ? (
                <>
                  {' '}
                  <span className={styles.measure}>
                    {measureLabel(ingredient.measure, { servings, system })}
                  </span>
                </>
              ) : null}
            </label>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose}>
          {t('shopping.cancel')}
        </Button>
        <Button
          disabled={selected.size === 0}
          icon={<ShoppingCart size={18} aria-hidden="true" />}
          // Na ordem da receita, para a lista sair na mesma ordem dos ingredientes
          onClick={() => onConfirm([...selected].sort((a, b) => a - b))}
        >
          {inList
            ? t('shopping.pickUpdate', { count: selected.size })
            : t('shopping.pickConfirm', { count: selected.size })}
        </Button>
      </div>
    </Dialog>
  )
}
