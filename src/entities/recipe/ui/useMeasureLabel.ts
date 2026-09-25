import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { convertMeasure } from '../lib/convertMeasure'
import { formatQuantity } from '../lib/formatQuantity'
import { unitDefinition } from '../lib/measureUnits'
import { parseMeasure } from '../lib/parseMeasure'
import { translateMeasureNote } from '../lib/translateMeasureNote'
import type { MeasureSystem } from '../model/recipe.types'

interface MeasureOptions {
  servings: number
  system: MeasureSystem
}

/**
 * Transforma "3/4 cup" em "180 ml" ou "¾ xícara", já multiplicado pelas porções.
 * O que o leitor não entende aparece como veio da API, sem sumir da lista.
 */
export function useMeasureLabel() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'pt-BR'

  return (raw: string, { servings, system }: MeasureOptions): string => {
    const measure = convertMeasure(parseMeasure(raw), {
      factor: servings / BASE_SERVINGS,
      system,
    })

    if (measure.quantity === null) return translateMeasureNote(measure.note, language, 1)

    const definition = measure.unit ? unitDefinition(measure.unit) : null
    const style = definition?.metric ? 'decimal' : 'fraction'
    const format = (value: number) => formatQuantity(value, { style, language })
    const amount =
      measure.quantityMax === null
        ? format(measure.quantity)
        : `${format(measure.quantity)}–${format(measure.quantityMax)}`
    // "½ xícara" fica no singular: abaixo de 1 conta como 1
    const count = Math.max(1, measure.quantityMax ?? measure.quantity)
    const unit = measure.unit ? t(`units.${measure.unit}`, { count }) : ''
    const note = translateMeasureNote(measure.note, language, count)
    const parts = definition?.prefix ? [unit, amount, note] : [amount, unit, note]

    return parts.filter(Boolean).join(' ')
  }
}
