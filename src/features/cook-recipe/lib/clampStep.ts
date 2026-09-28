/**
 * O passo vem da URL (?passo=3), então pode ser qualquer coisa. Vale de 1 até o
 * último: concluir a receita volta para o início, sem uma tela depois do fim.
 */
export function clampStep(value: string | null, total: number): number {
  const step = Number(value)

  if (!Number.isInteger(step) || step < 1) return 1

  return Math.min(step, Math.max(total, 1))
}

/** "Passo 3 de 6" é 50% pronto, como no design. */
export function progressPercent(step: number, total: number): number {
  if (total === 0) return 100

  return Math.round((Math.min(step, total) / total) * 100)
}
