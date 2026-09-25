import { useSearchParams } from 'react-router'
import { BASE_SERVINGS } from '@/shared/config'
import { clampServings } from '../lib/clampServings'

export const SERVINGS_PARAM = 'porcoes'

/**
 * As porções ficam na URL (?porcoes=6): o link compartilhado abre com a mesma
 * quantidade, e o modo cozinha recebe o valor sem precisar de estado global.
 */
export function useServings(): [number, (servings: number) => void] {
  const [params, setParams] = useSearchParams()
  const servings = clampServings(params.get(SERVINGS_PARAM))

  function setServings(next: number) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        const value = clampServings(next)

        // Na base a URL fica limpa: /receita/52772 e não /receita/52772?porcoes=4
        if (value === BASE_SERVINGS) updated.delete(SERVINGS_PARAM)
        else updated.set(SERVINGS_PARAM, String(value))

        return updated
      },
      // Cada clique no + não vira uma entrada no histórico do botão voltar
      { replace: true },
    )
  }

  return [servings, setServings]
}
