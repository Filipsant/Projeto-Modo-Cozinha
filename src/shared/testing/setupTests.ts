import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { i18next } from '@/shared/i18n'
import { server } from './msw/server'

// Qualquer requisição sem handler quebra o teste: nenhum teste depende da internet
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// O detector de idioma leria o navigator do jsdom, que é en-US. Nos testes o
// idioma é fixo em português, e quem quiser testar inglês troca dentro do teste.
beforeEach(async () => {
  await i18next.changeLanguage('pt-BR')
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})

afterAll(() => server.close())
