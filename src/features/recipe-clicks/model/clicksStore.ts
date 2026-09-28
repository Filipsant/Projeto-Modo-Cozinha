import { useEffect, useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addOpen, countClicks, pruneOpens, type RecipeOpens } from '../lib/clicks'

interface ClicksState {
  opens: RecipeOpens
  registerOpen: (recipeId: string, now?: number) => void
  prune: (now: number) => void
}

// Os cliques ficam neste aparelho: não há servidor juntando os de todo mundo.
// É o que alimenta o ranking "Em alta na bancada" da home
export const useClicksStore = create<ClicksState>()(
  persist(
    (set) => ({
      opens: {},
      registerOpen: (recipeId, now = Date.now()) =>
        set((state) => ({ opens: addOpen(state.opens, recipeId, now) })),
      prune: (now) => set((state) => ({ opens: pruneOpens(state.opens, now) })),
    }),
    {
      name: 'modo-cozinha:clicks',
      version: 1,
      partialize: (state) => ({ opens: state.opens }),
      // Quem volta depois de uma semana não vê o ranking velho
      onRehydrateStorage: () => (state) => state?.prune(Date.now()),
    },
  ),
)

/** Conta uma abertura da receita. Recebe undefined enquanto ela carrega. */
export function useTrackRecipeOpen(recipeId: string | undefined) {
  const registerOpen = useClicksStore((state) => state.registerOpen)

  useEffect(() => {
    if (recipeId) registerOpen(recipeId)
  }, [recipeId, registerOpen])
}

/** Cliques por receita nos últimos 7 dias. */
export function useClickCounts(): Record<string, number> {
  const opens = useClicksStore((state) => state.opens)

  return useMemo(() => countClicks(opens), [opens])
}
