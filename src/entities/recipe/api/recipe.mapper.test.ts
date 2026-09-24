import { describe, expect, it } from 'vitest'
import { fixtures } from '@/shared/testing'
import { mealsResponseDto } from './recipe.dto'
import { toRecipe } from './recipe.mapper'

describe('mapper da receita', () => {
  it('converte uma resposta real da TheMealDB', () => {
    const { meals } = mealsResponseDto.parse(fixtures.lookupTeriyaki)
    const receita = toRecipe(meals![0])

    expect(receita.id).toBe('52772')
    expect(receita.name).toBe('Teriyaki Chicken Casserole')
    expect(receita.category).toBe('Chicken')
    expect(receita.area).toBe('Japan')
    expect(receita.youtubeUrl).toContain('youtube.com')
    expect(receita.tags).toEqual(['Meat', 'Casserole'])
  })

  it('ignora os campos de ingrediente vazios do fim da lista', () => {
    const { meals } = mealsResponseDto.parse(fixtures.lookupTeriyaki)
    const receita = toRecipe(meals![0])

    expect(receita.ingredients).toHaveLength(9)
    expect(receita.ingredients[0]).toEqual({ name: 'soy sauce', measure: '3/4 cup' })
    expect(receita.ingredients.at(-1)).toEqual({ name: 'brown rice', measure: '3 cups' })
    expect(receita.ingredients.every((item) => item.name.length > 0)).toBe(true)
  })

  it('deriva tempo e dificuldade, que a API não fornece', () => {
    const { meals } = mealsResponseDto.parse(fixtures.lookupTeriyaki)
    const receita = toRecipe(meals![0])

    expect(receita.estimatedMinutes).toBeGreaterThan(0)
    expect(['easy', 'medium', 'hard']).toContain(receita.difficulty)
  })

  it('entende a resposta de busca sem resultados', () => {
    const { meals } = mealsResponseDto.parse(fixtures.searchEmpty)

    expect(meals).toBeNull()
  })

  it('aceita receita sem vídeo, sem tags e sem instruções', () => {
    const { meals } = mealsResponseDto.parse({
      meals: [
        {
          idMeal: '1',
          strMeal: 'Teste',
          strMealThumb: 'foto.jpg',
          strCategory: null,
          strArea: '',
          strInstructions: null,
          strTags: null,
          strYoutube: '',
          strIngredient1: 'sal',
          strMeasure1: null,
        },
      ],
    })
    const receita = toRecipe(meals![0])

    expect(receita.youtubeUrl).toBeUndefined()
    expect(receita.area).toBeUndefined()
    expect(receita.tags).toEqual([])
    expect(receita.steps).toEqual([])
    expect(receita.ingredients).toEqual([{ name: 'sal', measure: '' }])
  })
  it('usa strCountry como origem e cai em strArea quando falta', () => {
    const { meals } = mealsResponseDto.parse({
      meals: [
        {
          idMeal: '1',
          strMeal: 'Com país',
          strMealThumb: 'f.jpg',
          strCountry: 'Brazil',
          strArea: 'Brazilian',
        },
        {
          idMeal: '2',
          strMeal: 'Só área',
          strMealThumb: 'f.jpg',
          strCountry: null,
          strArea: 'British',
        },
        { idMeal: '3', strMeal: 'Sem nada', strMealThumb: 'f.jpg' },
      ],
    })

    expect(meals!.map((meal) => toRecipe(meal).area)).toEqual(['Brazil', 'British', undefined])
  })
})
