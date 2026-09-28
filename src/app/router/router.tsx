import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from '@/widgets/app-layout'
import { RootRoute } from './RootRoute'
import { RouteError } from './RouteError'

// Cada página só é baixada quando a rota dela é aberta (RNF03)
export const routes: RouteObject[] = [
  {
    // Cuida da rolagem ao trocar de página
    Component: RootRoute,
    // Tela mostrada quando alguma página quebra
    ErrorBoundary: RouteError,
    // Tela mostrada enquanto o código da primeira página é baixado
    HydrateFallback: () => null,
    children: [
      {
        // Rota mãe sem caminho: só serve para envolver as telas de baixo
        // com cabeçalho, navegação e rodapé
        Component: AppLayout,
        children: [
          {
            index: true,
            lazy: async () => {
              const { HomePage } = await import('@/pages/home')
              return { Component: HomePage }
            },
          },
          {
            path: 'receita/:id',
            lazy: async () => {
              const { RecipeDetailsPage } = await import('@/pages/recipe-details')
              return { Component: RecipeDetailsPage }
            },
          },
          {
            path: 'favoritos',
            lazy: async () => {
              const { FavoritesPage } = await import('@/pages/favorites')
              return { Component: FavoritesPage }
            },
          },
          {
            path: 'lista-de-compras',
            lazy: async () => {
              const { ShoppingListPage } = await import('@/pages/shopping-list')
              return { Component: ShoppingListPage }
            },
          },
          {
            path: '*',
            lazy: async () => {
              const { NotFoundPage } = await import('@/pages/not-found')
              return { Component: NotFoundPage }
            },
          },
        ],
      },
      {
        // Fora do AppLayout: o modo cozinha ocupa a tela inteira, sem cabeçalho
        path: 'receita/:id/cozinhar',
        lazy: async () => {
          const { CookingModePage } = await import('@/pages/cooking-mode')
          return { Component: CookingModePage }
        },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
