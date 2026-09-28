import type { FoodIllustrationName } from '@/shared/ui'
import type { RecipeSummary } from '../model/recipe.types'

// O nome diz mais que a categoria: "Chicken Soup" é sopa, e não frango. A ordem
// importa, porque o primeiro que casa ganha: "Chocolate Cake" é chocolate
const BY_NAME: [RegExp, FoodIllustrationName][] = [
  [/\b(?:soup|broth|chowder|ramen|pho|bisque|gazpacho|borscht)\b/, 'soup'],
  [/\b(?:stew|curry|casserole|chilli|chili|goulash|tagine|hotpot|pot)\b/, 'pot'],
  [/\bsalad\b/, 'salad'],
  [/\b(?:pancakes?|crepes?|waffles?)\b/, 'pancakes'],
  [/\b(?:chocolate|brownies?|fudge)\b/, 'chocolate'],
  [/(?:cake|gateau|torte)\b/, 'cake'],
  [/\b(?:pudding|flan|custard|mousse|trifle|jelly)\b/, 'pudding'],
  [/\b(?:bread|loaf|buns?|scones?|brioche)\b/, 'bread'],
  [/\b(?:naan|pizza|flatbread|tortillas?|chapati|roti|focaccia|quesadillas?)\b/, 'flatbread'],
  [/\b(?:wraps?|burritos?|rolls?|kebabs?|shawarma|tacos?|sandwich)\b/, 'wrap'],
  [/\b(?:fish|salmon|tuna|cod|haddock|trout|mackerel|sardines?|bass)\b/, 'fish'],
  [/\b(?:cheese|halloumi|feta|paneer)\b/, 'cheese'],
  [/\b(?:bacon|ham)\b/, 'bacon'],
  [/\b(?:potato(?:es)?|chips|fries|gnocchi)\b/, 'potato'],
  [/\b(?:eggs?|omelette|frittata|shakshuka)\b/, 'pan'],
  [
    /\b(?:pasta|spaghetti|penne|lasagne|lasagna|linguine|fettuccine|noodles?|macaroni|ravioli)\b/,
    'pasta',
  ],
  [/\b(?:rice|risotto|paella|biryani|pilaf|kedgeree)\b/, 'bowl'],
  [/\b(?:steak|beef|burgers?)\b/, 'steak'],
  [/\b(?:chicken|duck|turkey)\b/, 'chicken'],
  [/\bcarrots?\b/, 'carrot'],
  [/\b(?:cocktail|smoothie|lassi|juice|drink)\b/, 'glass'],
]

const BY_CATEGORY: Record<string, FoodIllustrationName> = {
  Beef: 'steak',
  Breakfast: 'pancakes',
  Chicken: 'chicken',
  Dessert: 'cake',
  Goat: 'steak',
  Lamb: 'steak',
  Miscellaneous: 'pot',
  Pasta: 'pasta',
  Pork: 'bacon',
  Seafood: 'fish',
  Side: 'potato',
  Starter: 'bowl',
  Vegan: 'leaf',
  Vegetarian: 'salad',
}

/** A ilustração de traço que representa a receita: pelo nome e, se não der, pela categoria. */
export function illustrationFor(
  recipe: Pick<RecipeSummary, 'name' | 'category'>,
): FoodIllustrationName {
  const name = recipe.name.toLowerCase()
  const match = BY_NAME.find(([pattern]) => pattern.test(name))

  if (match) return match[1]

  return (recipe.category && BY_CATEGORY[recipe.category]) || 'bowl'
}
