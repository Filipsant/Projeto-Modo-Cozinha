import { useEffect, useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** system: segue o celular/computador até a pessoa escolher um dos dois. */
export type ThemePreference = 'system' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'modo-cozinha:theme'

// As mesmas cores do fundo da página, para a barra do navegador combinar
const THEME_COLORS: Record<Theme, string> = { light: '#F8F9FA', dark: '#12141A' }

interface ThemeState {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

// O index.html lê esta mesma chave antes do React carregar (RF23): quem escolheu
// o escuro não vê a tela piscar branca ao abrir o app
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    { name: THEME_STORAGE_KEY, version: 1 },
  ),
)

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystem(onChange: () => void): () => void {
  if (typeof window.matchMedia !== 'function') return () => {}

  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', onChange)

  return () => query.removeEventListener('change', onChange)
}

function systemTheme(): Theme {
  return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches
    ? 'dark'
    : 'light'
}

/** O tema que está na tela: a escolha da pessoa ou, sem escolha, o do sistema. */
export function useEffectiveTheme(): Theme {
  const preference = useThemeStore((state) => state.preference)
  const system = useSyncExternalStore(subscribeToSystem, systemTheme, () => 'light' as const)

  return preference === 'system' ? system : preference
}

/**
 * Aplica a escolha no <html>. Sem escolha, tira o data-theme e deixa o CSS
 * seguir o prefers-color-scheme sozinho.
 */
export function useApplyTheme(): void {
  const preference = useThemeStore((state) => state.preference)
  const theme = useEffectiveTheme()

  useEffect(() => {
    const root = document.documentElement

    if (preference === 'system') delete root.dataset.theme
    else root.dataset.theme = preference

    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      meta.content = THEME_COLORS[theme]
    }
  }, [preference, theme])
}
