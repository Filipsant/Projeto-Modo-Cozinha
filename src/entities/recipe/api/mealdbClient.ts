import { API_BASE_URL } from '@/shared/config'
import { fetchJson } from '@/shared/lib'
import type { Recipe } from '../model/recipe.types'
import { mealsResponseDto } from './recipe.dto'
import { toRecipe } from './recipe.mapper'

interface RequestOptions {
  /** Vem do TanStack Query: cancela a busca anterior quando o usuário digita de novo (RF01). */
  signal?: AbortSignal
}

async function fetchMeals(path: string, options: RequestOptions): Promise<Recipe[]> {
  const data = await fetchJson(`${API_BASE_URL}${path}`, { signal: options.signal })
  const { meals } = mealsResponseDto.parse(data)

  return (meals ?? []).map(toRecipe)
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export const mealdbClient = {
  async search(term: string, options: RequestOptions = {}): Promise<Recipe[]> {
    return fetchMeals(`/search.php?s=${encodeURIComponent(term)}`, options)
  },

  /** null quando o id não existe: a API responde 200 com { "meals": null }. */
  async getById(id: string, options: RequestOptions = {}): Promise<Recipe | null> {
    const meals = await fetchMeals(`/lookup.php?i=${encodeURIComponent(id)}`, options)

    return meals[0] ?? null
  },

  async getRandom(options: RequestOptions = {}): Promise<Recipe | null> {
    const meals = await fetchMeals('/random.php', options)

    return meals[0] ?? null
  },

  /** Todas as receitas cuja inicial é a letra pedida. */
  async listByLetter(letter: string, options: RequestOptions = {}): Promise<Recipe[]> {
    return fetchMeals(`/search.php?f=${letter}`, options)
  },

  // A busca da API corta em 25 resultados, então montamos o catálogo completo
  // percorrendo as 26 letras. São ~790 receitas e ~1,9 MB, buscados uma vez
  // por sessão e filtrados no cliente.
  async listCatalog(options: RequestOptions = {}): Promise<Recipe[]> {
    const porLetra = await Promise.all(
      ALPHABET.map((letter) => mealdbClient.listByLetter(letter, options)),
    )
    const porId = new Map<string, Recipe>()

    for (const recipe of porLetra.flat()) {
      porId.set(recipe.id, recipe)
    }

    return [...porId.values()]
  },
}
