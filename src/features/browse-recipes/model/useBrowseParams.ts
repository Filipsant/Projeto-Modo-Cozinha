import { useSearchParams } from 'react-router'

const PARAMS = { term: 'q', category: 'categoria', area: 'origem' } as const

type Param = keyof typeof PARAMS

// Busca e filtros moram na URL (RF04, RF08 e RF09): recarregar a página ou
// compartilhar o link devolve exatamente a mesma tela.
export function useBrowseParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  function setParam(param: Param, value: string) {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)

        if (value.trim()) {
          next.set(PARAMS[param], value)
        } else {
          next.delete(PARAMS[param])
        }

        return next
      },
      // replace: cada letra digitada não vira um item no histórico do navegador
      { replace: true },
    )
  }

  const term = searchParams.get(PARAMS.term) ?? ''
  const category = searchParams.get(PARAMS.category) ?? ''
  const area = searchParams.get(PARAMS.area) ?? ''

  return {
    term,
    category,
    area,
    hasFilters: Boolean(term.trim() || category || area),
    setTerm: (value: string) => setParam('term', value),
    setCategory: (value: string) => setParam('category', value),
    setArea: (value: string) => setParam('area', value),
    clearFilters: () => setSearchParams(new URLSearchParams(), { replace: true }),
  }
}
