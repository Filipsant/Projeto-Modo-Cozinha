import { Languages } from 'lucide-react'
import { useTranslation } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import styles from './LanguageSwitcher.module.scss'

// Alterna entre os dois idiomas. A escolha fica no localStorage pelo detector
// do i18next, então sobrevive ao recarregar a página.
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const isPortuguese = i18n.resolvedLanguage === 'pt-BR'

  return (
    <Button
      variant="ghost"
      className={styles.switcher}
      onClick={() => void i18n.changeLanguage(isPortuguese ? 'en' : 'pt-BR')}
      title={t('language.switchTo')}
      aria-label={t('language.switchTo')}
      icon={<Languages size={18} aria-hidden="true" />}
    >
      {t('language.current')}
    </Button>
  )
}
