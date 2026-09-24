import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { i18next } from '@/shared/i18n'
import { renderWithProviders } from '@/shared/testing'
import { LanguageSwitcher } from './LanguageSwitcher'

afterEach(async () => {
  await i18next.changeLanguage('pt-BR')
})

describe('LanguageSwitcher', () => {
  it('troca a interface para inglês e volta', async () => {
    const { user } = renderWithProviders(<LanguageSwitcher />)

    expect(screen.getByRole('button', { name: 'Mudar para inglês' })).toHaveTextContent('PT')

    await user.click(screen.getByRole('button', { name: 'Mudar para inglês' }))

    expect(i18next.resolvedLanguage).toBe('en')
    expect(screen.getByRole('button', { name: 'Switch to Portuguese' })).toHaveTextContent('EN')
  })
})
