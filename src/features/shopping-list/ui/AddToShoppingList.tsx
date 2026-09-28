import { Check, ListChecks, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { MeasureSystem, Recipe } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import { isShoppable } from '../lib/aisleOf'
import {
  shoppableCount,
  useItemPositionsInList,
  useServingsInList,
  useShoppingListStore,
} from '../model/shoppingListStore'
import styles from './AddToShoppingList.module.scss'
import { IngredientPicker } from './IngredientPicker'

interface AddToShoppingListProps {
  recipe: Recipe
  servings: number
  /** Para as medidas do diálogo saírem no sistema escolhido no detalhe. */
  system: MeasureSystem
}

// Três estados no mesmo botão: adicionar, atualizar as porções e ver a lista.
// É sempre o mesmo <button>, para o foco não se perder quando o texto muda.
// Adicionar abre o diálogo para escolher os ingredientes; com a receita na lista,
// "Escolher ingredientes" reabre o diálogo com as marcas de agora
export function AddToShoppingList({ recipe, servings, system }: AddToShoppingListProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const servingsInList = useServingsInList(recipe.id)
  const positionsInList = useItemPositionsInList(recipe.id)
  const addRecipe = useShoppingListStore((state) => state.addRecipe)
  const [picking, setPicking] = useState(false)
  const inList = servingsInList !== null
  const upToDate = servingsInList === servings

  const label = upToDate
    ? t('shopping.inList')
    : inList
      ? t('shopping.update', { count: servings })
      : t('shopping.add')

  function handleClick() {
    if (upToDate) navigate('/lista-de-compras')
    else if (inList) addRecipe(recipe, servings)
    else setPicking(true)
  }

  return (
    <div className={styles.wrapper}>
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
        onClick={handleClick}
      >
        {label}{' '}
        <span className={styles.count}>
          {t('shopping.items', { count: inList ? positionsInList.length : shoppableCount(recipe) })}
        </span>
      </Button>

      {inList ? (
        <button type="button" className={styles.choose} onClick={() => setPicking(true)}>
          <ListChecks size={16} aria-hidden="true" />
          {t('shopping.chooseItems')}
        </button>
      ) : null}

      {/* Quem não vê o botão mudar de texto ouve que a receita entrou na lista */}
      <p className={styles.status} role="status">
        {inList ? t('shopping.added') : ''}
      </p>

      {picking ? (
        <IngredientPicker
          recipe={recipe}
          servings={servings}
          system={system}
          inList={inList}
          initialPositions={
            inList
              ? positionsInList
              : recipe.ingredients.flatMap((ingredient, position) =>
                  isShoppable(ingredient.name) ? [position] : [],
                )
          }
          onConfirm={(positions) => {
            addRecipe(recipe, servings, positions)
            setPicking(false)
          }}
          onClose={() => setPicking(false)}
        />
      ) : null}
    </div>
  )
}
