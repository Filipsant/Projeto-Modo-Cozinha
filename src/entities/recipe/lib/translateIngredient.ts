import { INGREDIENTS_PT_BR } from './ingredientsPtBr'

// Os nomes de ingrediente chegam em inglês e com caixa irregular ("Chicken",
// "chicken"). Em português, trocamos pelo dicionário; fora dele, fica como veio.
export function translateIngredient(name: string, language: string): string {
  if (!language.startsWith('pt')) return name

  const translated = INGREDIENTS_PT_BR[name.trim().toLowerCase()]

  return translated ? translated.charAt(0).toUpperCase() + translated.slice(1) : name
}
