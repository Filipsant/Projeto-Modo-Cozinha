import type { ptBR } from './locales/pt-BR'

// Deixa o t() com autocompletar e com erro de tipo quando a chave não existe
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof ptBR
    }
  }
}
