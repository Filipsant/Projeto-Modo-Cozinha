import type { Recipe } from '@/entities/recipe'

export type TrendingTabId = 'all' | 'pasta' | 'quick' | 'meat' | 'dessert' | 'vegetarian'

interface TrendingTab {
  id: TrendingTabId
  matches: (recipe: Recipe) => boolean
}

const MEATS = new Set(['Beef', 'Lamb', 'Pork', 'Goat'])

// As abas do destaque. "Sem glúten" ficou de fora: a API não informa, e deduzir
// pelos ingredientes seria prometer algo de que a saúde de alguém pode depender
export const TRENDING_TABS: TrendingTab[] = [
  { id: 'all', matches: () => true },
  { id: 'pasta', matches: (recipe) => recipe.category === 'Pasta' },
  { id: 'quick', matches: (recipe) => recipe.estimatedMinutes < 20 },
  { id: 'meat', matches: (recipe) => MEATS.has(recipe.category ?? '') },
  { id: 'dessert', matches: (recipe) => recipe.category === 'Dessert' },
  {
    id: 'vegetarian',
    matches: (recipe) => recipe.category === 'Vegetarian' || recipe.category === 'Vegan',
  },
]
