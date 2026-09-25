import { create } from 'zustand'

interface PwaState {
  /** O service worker já guardou o app: dá para abrir sem internet. */
  offlineReady: boolean
  /** Chegou uma versão nova; null enquanto não há o que atualizar. */
  applyUpdate: (() => void) | null
  setOfflineReady: () => void
  setUpdateAvailable: (applyUpdate: () => void) => void
  dismissUpdate: () => void
}

// Quem escreve aqui é o registro do service worker (src/app/pwa); a interface
// só lê. Assim os componentes são testáveis sem service worker de verdade.
export const usePwaStore = create<PwaState>()((set) => ({
  offlineReady: false,
  applyUpdate: null,
  setOfflineReady: () => set({ offlineReady: true }),
  setUpdateAvailable: (applyUpdate) => set({ applyUpdate }),
  dismissUpdate: () => set({ applyUpdate: null }),
}))
