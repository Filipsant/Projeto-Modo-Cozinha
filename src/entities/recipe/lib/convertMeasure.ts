import type { MeasureSystem, ParsedMeasure } from '../model/recipe.types'
import { unitDefinition } from './measureUnits'

interface ConvertOptions {
  /** Porções pedidas divididas pelas porções da receita: 6 de 4 dá 1,5. */
  factor: number
  system: MeasureSystem
}

/**
 * Multiplica pelas porções e, no sistema métrico, troca xícara, colher e onça
 * por ml e g. Unidades de contagem ("2 dentes") só multiplicam.
 */
export function convertMeasure(measure: ParsedMeasure, { factor, system }: ConvertOptions) {
  const scaled: ParsedMeasure = {
    ...measure,
    quantity: measure.quantity === null ? null : measure.quantity * factor,
    quantityMax: measure.quantityMax === null ? null : measure.quantityMax * factor,
  }

  if (scaled.quantity === null || !scaled.unit) return scaled

  const definition = unitDefinition(scaled.unit)

  if (definition.kind === 'count') return scaled
  if (system === 'original' && !definition.metric) return scaled

  // Daqui em diante é métrico: tudo passa por ml ou g e volta na unidade que ler melhor
  const base = definition.base ?? 1
  const small = definition.kind === 'volume' ? 'ml' : 'g'
  const large = definition.kind === 'volume' ? 'l' : 'kg'
  const quantity = scaled.quantity * base
  const quantityMax = scaled.quantityMax === null ? null : scaled.quantityMax * base
  const useLarge = (quantityMax ?? quantity) >= 1000

  return {
    ...scaled,
    unit: useLarge ? large : small,
    quantity: useLarge ? roundLarge(quantity / 1000) : roundSmall(quantity),
    quantityMax:
      quantityMax === null
        ? null
        : useLarge
          ? roundLarge(quantityMax / 1000)
          : roundSmall(quantityMax),
  } satisfies ParsedMeasure
}

// Ninguém mede 473 ml na cozinha: arredonda para números que dá para medir
function roundSmall(value: number): number {
  if (value < 10) return Math.max(0.5, Math.round(value * 2) / 2)
  if (value < 100) return Math.round(value)

  return Math.round(value / 5) * 5
}

function roundLarge(value: number): number {
  return Math.round(value * 20) / 20
}
