import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useApplyTheme } from '@/features/theme-switcher'
import { i18next } from '@/shared/i18n'
import { queryClient } from './queryClient'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // Aqui, e não no cabeçalho: o modo cozinha não tem cabeçalho e também segue o tema
  useApplyTheme()

  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  )
}
