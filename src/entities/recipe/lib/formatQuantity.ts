// As frações que existem nas xícaras e colheres medidoras
const FRACTIONS: [number, string][] = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [1 / 2, '½'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [1, ''],
]

/**
 * fraction: para xícaras, colheres e unidades ("1 ½", "¾"), como se mede na cozinha.
 * decimal: para g, ml, kg e L, no formato do idioma ("1,5" em português).
 */
export function formatQuantity(
  value: number,
  { style, language }: { style: 'fraction' | 'decimal'; language: string },
): string {
  if (style === 'decimal') {
    return new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(value)
  }

  let whole = Math.floor(value)
  const [nearest, glyph] = FRACTIONS.reduce((best, candidate) =>
    Math.abs(candidate[0] - (value - whole)) < Math.abs(best[0] - (value - whole))
      ? candidate
      : best,
  )

  if (nearest === 1) whole += 1

  // Uma quantidade pequena demais não some: vira a menor fração, e não "0"
  if (whole === 0 && !glyph) return value > 0 ? '⅛' : '0'
  if (!glyph) return String(whole)

  return whole === 0 ? glyph : `${whole} ${glyph}`
}
