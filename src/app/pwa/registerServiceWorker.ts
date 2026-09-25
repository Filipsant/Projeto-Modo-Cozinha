import { registerSW } from 'virtual:pwa-register'
import { usePwaStore } from '@/features/app-update'

const HOUR = 60 * 60 * 1000

/**
 * Registra o service worker gerado pelo vite-plugin-pwa e repassa os eventos
 * para o store, que a interface lê. No `npm run dev` não há service worker:
 * ele só existe no build, para o cache não atrapalhar quem está programando.
 */
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return

  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      // true: ativa a versão nova e recarrega a página
      usePwaStore.getState().setUpdateAvailable(() => void updateServiceWorker(true))
    },
    onOfflineReady() {
      usePwaStore.getState().setOfflineReady()
    },
    onRegisteredSW(_url, registration) {
      if (!registration) return

      // Em visitas seguintes o onOfflineReady não dispara de novo: o app já está guardado
      if (registration.active) usePwaStore.getState().setOfflineReady()

      // Quem deixa o app aberto na bancada o dia todo também recebe as atualizações
      window.setInterval(() => void registration.update(), HOUR)
    },
  })
}
