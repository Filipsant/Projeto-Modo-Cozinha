import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY, useApplyTheme, useThemeStore } from '../model/themeStore'
import { ThemeToggle } from './ThemeToggle'

// O jsdom não tem matchMedia: simulamos o tema do sistema
function sistemaNoEscuro(escuro: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: escuro && query.includes('dark'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

function App() {
  useApplyTheme()

  return <ThemeToggle />
}

beforeEach(() => {
  useThemeStore.setState({ preference: 'system' })
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ThemeToggle', () => {
  it('sem escolha, segue o sistema e não marca o <html>', () => {
    sistemaNoEscuro(true)
    render(<App />)

    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('troca o tema, marca o <html> e guarda a escolha', async () => {
    sistemaNoEscuro(false)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toMatchObject({
      state: { preference: 'dark' },
    })

    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('pinta a barra do navegador com a cor do tema', async () => {
    sistemaNoEscuro(false)
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.append(meta)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))

    expect(meta.content).toBe('#12141A')
    meta.remove()
  })

  it('funciona sem matchMedia, assumindo o tema claro', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeInTheDocument()
  })
})
