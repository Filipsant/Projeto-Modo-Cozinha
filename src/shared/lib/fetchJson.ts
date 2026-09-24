import { HttpError } from './HttpError'

// Devolve unknown de propósito: quem chama valida com Zod antes de confiar no dado.
export async function fetchJson(url: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new HttpError(response.status, url)
  }

  return response.json()
}
