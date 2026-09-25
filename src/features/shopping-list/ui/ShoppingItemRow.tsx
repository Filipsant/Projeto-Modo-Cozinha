import {
  parseMeasure,
  translateIngredient,
  useMeasureLabel,
  type MeasureSystem,
} from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import type { ShoppingItem } from '../model/shoppingListStore'
import { useShoppingListStore } from '../model/shoppingListStore'
import styles from './ShoppingItemRow.module.scss'

interface ShoppingItemRowProps {
  item: ShoppingItem
  servings: number
  system: MeasureSystem
  /** A linha de baixo: o corredor na visão por receita, a receita na visão por corredor. */
  detail: string
}

export function ShoppingItemRow({ item, servings, system, detail }: ShoppingItemRowProps) {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const measureLabel = useMeasureLabel()
  const toggleItem = useShoppingListStore((state) => state.toggleItem)
  const name = translateIngredient(item.name, language)
  const amount = item.measure ? measureLabel(item.measure, { servings, system }) : ''
  // "400 g Carne moída" como no design; sem número, a nota vai depois: "Sal (a gosto)"
  const hasQuantity = parseMeasure(item.measure).quantity !== null

  return (
    <label className={item.bought ? `${styles.row} ${styles.bought}` : styles.row}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={item.bought}
        onChange={() => toggleItem(item.id)}
      />
      <span className={styles.text}>
        <span className={styles.main}>
          {amount && hasQuantity ? (
            <>
              <strong className={styles.amount}>{amount}</strong> {name}
            </>
          ) : amount ? (
            `${name} (${amount})`
          ) : (
            name
          )}
        </span>{' '}
        <span className={styles.detail}>{detail}</span>
      </span>
    </label>
  )
}
