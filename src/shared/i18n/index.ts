export { i18next, SUPPORTED_LANGUAGES, type Language } from './i18n'
export { ptBR } from './locales/pt-BR'
// Passa pelo nosso módulo de propósito: se um dia trocarmos de biblioteca,
// muda só aqui, e não nos 40 componentes que usam t().
export { Trans, useTranslation } from 'react-i18next'
