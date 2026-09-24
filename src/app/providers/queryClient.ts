import { QueryClient } from '@tanstack/react-query'

// O staleTime de cada consulta fica junto das chaves, em entities/recipe/api/recipe.queries.ts
export const queryClient = new QueryClient()
