import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18next } from '@/shared/i18n'
import { useMeasureLabel } from './useMeasureLabel'

function rotulo(medida: string, servings: number, system: 'metric' | 'original') {
  const { result } = renderHook(() => useMeasureLabel())

  return result.current(medida, { servings, system })
}

describe('useMeasureLabel', () => {
  it('mostra em g e ml no sistema métrico', () => {
    expect(rotulo('3/4 cup', 4, 'metric')).toBe('180 ml')
    expect(rotulo('1 lb', 4, 'metric')).toBe('455 g')
    expect(rotulo('5 cups', 4, 'metric')).toBe('1,2 L')
  })

  it('mostra frações e o nome da unidade em português no sistema original', () => {
    expect(rotulo('3/4 cup', 4, 'original')).toBe('¾ xícara')
    expect(rotulo('3/4 cup', 8, 'original')).toBe('1 ½ xícara')
    expect(rotulo('1/2 tsp', 16, 'original')).toBe('2 colheres de chá')
  })

  it('multiplica pelas porções, com a base de 4', () => {
    expect(rotulo('200g', 6, 'metric')).toBe('300 g')
    expect(rotulo('2 cloves minced', 6, 'metric')).toBe('3 dentes picados')
    expect(rotulo('2-3', 8, 'metric')).toBe('4–6')
  })

  it('põe o nome antes do número em "suco de 2"', () => {
    expect(rotulo('Juice of 1', 8, 'metric')).toBe('suco de 2')
  })

  it('traduz o que não tem número e mantém o que não entende', () => {
    expect(rotulo('To taste', 4, 'metric')).toBe('a gosto')
    expect(rotulo('Pinch', 4, 'metric')).toBe('1 pitada')
    expect(rotulo('1 cut into wedges', 4, 'metric')).toBe('1 cut into wedges')
  })

  it('em inglês usa as unidades e a vírgula decimal do inglês', async () => {
    await i18next.changeLanguage('en')

    expect(rotulo('3/4 cup', 8, 'original')).toBe('1 ½ cups')
    expect(rotulo('5 cups', 4, 'metric')).toBe('1.2 L')
  })
})
