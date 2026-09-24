import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ptBR } from './locales/pt-BR'

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

const STORAGE_KEY = 'modo-cozinha:language'

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      en: { translation: en },
    },
    // Sem supportedLngs de propósito: com ele e nonExplicitSupportedLngs o i18next
    // procura o dicionário em "pt" e não acha o nosso, que está em "pt-BR".
    // Só com fallbackLng, en-US cai em en, e qualquer outro idioma cai em pt-BR.
    fallbackLng: 'pt-BR',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      // O React já escapa o que renderiza
      escapeValue: false,
    },
    // Os dicionários vêm no bundle: sem carregamento assíncrono, o componente
    // não precisa suspender enquanto espera tradução
    react: { useSuspense: false },
  })

export { i18next }
