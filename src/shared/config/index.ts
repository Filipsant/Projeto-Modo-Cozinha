// Chave de teste "1": liberada pela TheMealDB para uso educacional e de desenvolvimento
export const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// A API não informa o rendimento das receitas, então adotamos 4 porções como base
export const BASE_SERVINGS = 4
export const MIN_SERVINGS = 1
export const MAX_SERVINGS = 20

// Tradutor público do Google, sem chave e com CORS aberto: traduz os passos das
// receitas, que a TheMealDB só tem em inglês
export const TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single'
