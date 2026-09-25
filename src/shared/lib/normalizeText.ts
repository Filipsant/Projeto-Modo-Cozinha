/** Para comparar textos: "Açúcar" vira "acucar", e "CHICKEN" vira "chicken". */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}
