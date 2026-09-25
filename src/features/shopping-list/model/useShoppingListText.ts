import {
  parseMeasure,
  translateIngredient,
  useMeasureLabel,
  type MeasureSystem,
} from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { useShoppingListStore } from './shoppingListStore'

/**
 * A lista em texto puro, para mandar no WhatsApp: só o que falta comprar,
 * agrupado por receita e com as medidas já convertidas.
 */
export function useShoppingListText(system: MeasureSystem): () => string {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'
  const measureLabel = useMeasureLabel()
  const recipes = useShoppingListStore((state) => state.recipes)
  const items = useShoppingListStore((state) => state.items)

  return () => {
    const sections = recipes
      .map((recipe) => {
        const lines = items
          .filter((item) => item.recipeId === recipe.id && !item.bought)
          .map((item) => {
            const name = translateIngredient(item.name, language)
            const amount = item.measure
              ? measureLabel(item.measure, { servings: recipe.servings, system })
              : ''

            if (!amount) return `• ${name}`

            return parseMeasure(item.measure).quantity === null
              ? `• ${name} (${amount})`
              : `• ${amount} ${name}`
          })

        if (lines.length === 0) return null

        const heading = `${recipe.name} (${t('common.servings', { count: recipe.servings })})`

        return [heading, ...lines].join('\n')
      })
      .filter((section): section is string => section !== null)

    return [`${t('shopping.shareTitle')} · ${t('common.appName')}`, ...sections].join('\n\n')
  }
}
