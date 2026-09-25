import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MeasureSystem } from '@/entities/recipe'

interface MeasureSystemState {
  system: MeasureSystem
  setSystem: (system: MeasureSystem) => void
}

// É uma preferência da pessoa, e não da receita: vale para todas e sobrevive ao
// fechar o navegador. Por isso fica no localStorage, e não na URL como as porções.
export const useMeasureSystemStore = create<MeasureSystemState>()(
  persist(
    (set) => ({
      // Métricas por padrão, como no design: é o que se usa no Brasil
      system: 'metric',
      setSystem: (system) => set({ system }),
    }),
    { name: 'modo-cozinha:measure-system', version: 1 },
  ),
)

export function useMeasureSystem(): MeasureSystem {
  return useMeasureSystemStore((state) => state.system)
}
