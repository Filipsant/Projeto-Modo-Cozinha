import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { i18next } from '@/shared/i18n'

export function createTestQueryClient() {
  return new QueryClient({
    // Sem novas tentativas: o erro da API aparece na hora, sem deixar o teste lento
    defaultOptions: { queries: { retry: false } },
  })
}

interface RenderWithProvidersOptions {
  /** URL inicial, por exemplo '/receita/52772?porcoes=6' */
  route?: string
  /** Padrão da rota, para o useParams funcionar, por exemplo '/receita/:id' */
  path?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', path = '*' }: RenderWithProvidersOptions = {},
) {
  const user = userEvent.setup()
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter([{ path, element: ui }], { initialEntries: [route] })

  return {
    user,
    queryClient,
    router,
    ...render(
      <I18nextProvider i18n={i18next}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </I18nextProvider>,
    ),
  }
}
