import { Check, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Recipe } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import { shoppableCount, useServingsInList, useShoppingListStore } from '../model/shoppingListStore'
import styles from './AddToShoppingList.module.scss'

interface AddToShoppingListProps {
  recipe: Recipe
  servings: number
}

// Três estados no mesmo botão: adicionar, atualizar as porções e ver a lista.
// É sempre o mesmo <button>, para o foco não se perder quando o texto muda.
export function AddToShoppingList({ recipe, servings }: AddToShoppingListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const servingsInList = useServingsInList(recipe.id)
  const addRecipe = useShoppingListStore((state) => state.addRecipe)
  const upToDate = servingsInList === servings

  const label = upToDate
    ? t('shopping.inList')
    : servingsInList === null
      ? t('shopping.add')
      : t('shopping.update', { count: servings })

  return (
    <>
      <Button
        variant="secondary"
        fullWidth
        className={styles.button}
        icon={
          upToDate ? (
            <Check size={20} aria-hidden="true" />
          ) : (
            <ShoppingCart size={20} aria-hidden="true" />
          )
        }
        onClick={() => (upToDate ? navigate('/lista-de-compras') : addRecipe(recipe, servings))}
      >
        {label}{' '}
        <span className={styles.count}>
          {t('shopping.items', { count: shoppableCount(recipe) })}
        </span>
      </Button>

      {/* Quem não vê o botão mudar de texto ouve que a receita entrou na lista */}
      <p className={styles.status} role="status">
        {servingsInList === null ? '' : t('shopping.added')}
      </p>
    </>
  )
}
