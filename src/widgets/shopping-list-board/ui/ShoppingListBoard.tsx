import { CheckCircle2, ChevronDown, CookingPot, Trash2 } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router'
import type { MeasureSystem } from '@/entities/recipe'
import {
  AISLES,
  ShoppingItemRow,
  aisleOf,
  useShoppingListStore,
  type Aisle,
  type ShoppingItem,
  type ShoppingRecipe,
} from '@/features/shopping-list'
import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { Card, IconButton } from '@/shared/ui'
import styles from './ShoppingListBoard.module.scss'

export type ShoppingGrouping = 'recipe' | 'aisle'

interface ShoppingListBoardProps {
  grouping: ShoppingGrouping
  system: MeasureSystem
}

// Os pendentes em grupos (por receita ou por corredor) e, embaixo, o que já foi comprado
export function ShoppingListBoard({ grouping, system }: ShoppingListBoardProps) {
  const { t } = useTranslation()
  const recipes = useShoppingListStore((state) => state.recipes)
  const items = useShoppingListStore((state) => state.items)
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]))
  const pending = items.filter((item) => !item.bought)
  const bought = items.filter((item) => item.bought)
  const servingsOf = (item: ShoppingItem) =>
    recipeById.get(item.recipeId)?.servings ?? BASE_SERVINGS

  return (
    <div className={styles.board}>
      {pending.length > 0 ? (
        <div className={styles.groups}>
          {grouping === 'recipe'
            ? recipes.map((recipe) => (
                <RecipeGroup
                  key={recipe.id}
                  recipe={recipe}
                  items={pending.filter((item) => item.recipeId === recipe.id)}
                  system={system}
                />
              ))
            : AISLES.map((aisle) => (
                <AisleGroup
                  key={aisle}
                  aisle={aisle}
                  items={pending.filter((item) => aisleOf(item.name) === aisle)}
                  system={system}
                  recipeName={(item) => recipeById.get(item.recipeId)?.name ?? ''}
                  servingsOf={servingsOf}
                />
              ))}
        </div>
      ) : null}

      {bought.length > 0 ? (
        <details className={styles.bought} open>
          <summary className={styles.boughtSummary}>
            <CheckCircle2 size={20} className={styles.boughtIcon} aria-hidden="true" />
            <span className={styles.boughtTitle}>{t('shopping.bought')}</span>
            <span className={styles.boughtCount}>{bought.length}</span>
            <ChevronDown size={20} className={styles.chevron} aria-hidden="true" />
          </summary>
          <ul className={styles.list} role="list">
            {bought.map((item) => (
              <li key={item.id}>
                <ShoppingItemRow
                  item={item}
                  servings={servingsOf(item)}
                  system={system}
                  detail={t(`shopping.aisles.${aisleOf(item.name)}`)}
                />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

interface RecipeGroupProps {
  recipe: ShoppingRecipe
  items: ShoppingItem[]
  system: MeasureSystem
}

function RecipeGroup({ recipe, items, system }: RecipeGroupProps) {
  const { t } = useTranslation()
  const titleId = useId()
  const removeRecipe = useShoppingListStore((state) => state.removeRecipe)
  const link =
    recipe.servings === BASE_SERVINGS
      ? `/receita/${recipe.id}`
      : `/receita/${recipe.id}?porcoes=${recipe.servings}`

  // Tudo comprado: o grupo some, e os itens aparecem em "Itens já comprados"
  if (items.length === 0) return null

  return (
    <Card className={styles.group} role="region" aria-labelledby={titleId}>
      <div className={styles.groupHeader}>
        <span className={styles.groupIcon} aria-hidden="true">
          <CookingPot size={20} />
        </span>
        <div className={styles.groupTitles}>
          <h2 id={titleId} className={styles.groupTitle}>
            <Link to={link} className={styles.groupLink}>
              {recipe.name}
            </Link>
          </h2>
          <p className={styles.groupSubtitle}>{t('common.servings', { count: recipe.servings })}</p>
        </div>
        <span className={styles.groupCount}>{t('shopping.items', { count: items.length })}</span>
        <IconButton
          label={t('shopping.removeRecipe', { name: recipe.name })}
          onClick={() => removeRecipe(recipe.id)}
        >
          <Trash2 size={18} aria-hidden="true" />
        </IconButton>
      </div>

      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id}>
            <ShoppingItemRow
              item={item}
              servings={recipe.servings}
              system={system}
              detail={t(`shopping.aisles.${aisleOf(item.name)}`)}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

interface AisleGroupProps {
  aisle: Aisle
  items: ShoppingItem[]
  system: MeasureSystem
  recipeName: (item: ShoppingItem) => string
  servingsOf: (item: ShoppingItem) => number
}

function AisleGroup({ aisle, items, system, recipeName, servingsOf }: AisleGroupProps) {
  const { t } = useTranslation()
  const titleId = useId()

  if (items.length === 0) return null

  return (
    <Card className={styles.group} role="region" aria-labelledby={titleId}>
      <div className={styles.groupHeader}>
        <div className={styles.groupTitles}>
          <h2 id={titleId} className={styles.groupTitle}>
            {t(`shopping.aisles.${aisle}`)}
          </h2>
        </div>
        <span className={styles.groupCount}>{t('shopping.items', { count: items.length })}</span>
      </div>

      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id}>
            <ShoppingItemRow
              item={item}
              servings={servingsOf(item)}
              system={system}
              detail={recipeName(item)}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}
