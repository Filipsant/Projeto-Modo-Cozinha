import { useSearchParams } from 'react-router'
import { clampStep } from '../lib/clampStep'

export const STEP_PARAM = 'passo'

/**
 * O passo atual fica na URL: recarregar a página, ou o celular descarregar a
 * aba, não faz a pessoa voltar ao passo 1 no meio da receita. As porções
 * (?porcoes=6) continuam na URL junto.
 */
export function useCookingStep(total: number): [number, (step: number) => void] {
  const [params, setParams] = useSearchParams()
  const step = clampStep(params.get(STEP_PARAM), total)

  function setStep(next: number) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)

        updated.set(STEP_PARAM, String(clampStep(String(next), total)))

        return updated
      },
      // O botão voltar do navegador sai do modo cozinha, e não volta um passo
      { replace: true },
    )
  }

  return [step, setStep]
}
