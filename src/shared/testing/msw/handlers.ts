import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/shared/config'
import { fixtures } from '../fixtures'

// Respondem com as respostas reais salvas em fixtures/. Um teste que precise de
// outro cenário usa server.use(...) para trocar só o handler daquele caso.
export const handlers = [
  http.get(`${API_BASE_URL}/search.php`, ({ request }) => {
    const term = new URL(request.url).searchParams.get('s')?.toLowerCase() ?? ''

    // Busca vazia devolve a seleção inicial, como a API de verdade faz
    if (term && !'chicken'.includes(term.slice(0, 3))) {
      return HttpResponse.json(fixtures.searchEmpty)
    }

    return HttpResponse.json(fixtures.searchChicken)
  }),

  http.get(`${API_BASE_URL}/lookup.php`, ({ request }) => {
    const id = new URL(request.url).searchParams.get('i')

    return HttpResponse.json(id === '52772' ? fixtures.lookupTeriyaki : fixtures.searchEmpty)
  }),

  http.get(`${API_BASE_URL}/random.php`, () => HttpResponse.json(fixtures.lookupTeriyaki)),

  http.get(`${API_BASE_URL}/categories.php`, () => HttpResponse.json(fixtures.categories)),

  http.get(`${API_BASE_URL}/list.php`, () => HttpResponse.json(fixtures.areas)),

  http.get(`${API_BASE_URL}/filter.php`, () => HttpResponse.json(fixtures.filterSeafood)),
]
