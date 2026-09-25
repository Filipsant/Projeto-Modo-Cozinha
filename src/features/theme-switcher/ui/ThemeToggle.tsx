import { Moon, Sun } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { IconButton } from '@/shared/ui'
import { useEffectiveTheme, useThemeStore } from '../model/themeStore'

// O sol do design: no escuro mostra o sol (voltar ao claro), no claro mostra a lua
export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useEffectiveTheme()
  const setPreference = useThemeStore((state) => state.setPreference)
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <IconButton
      label={next === 'dark' ? t('theme.toDark') : t('theme.toLight')}
      onClick={() => setPreference(next)}
    >
      {theme === 'dark' ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </IconButton>
  )
}
