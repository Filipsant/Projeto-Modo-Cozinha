export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

interface ShareContent {
  title: string
  text?: string
  url?: string
}

/**
 * No celular abre o menu de compartilhar do sistema; onde ele não existe, copia
 * o texto (ou o link) para a área de transferência. Quem chama decide o aviso.
 */
export async function shareContent({ title, text, url }: ShareContent): Promise<ShareResult> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url })

      return 'shared'
    } catch {
      // Fechar o menu sem escolher nada também cai aqui: não é erro para mostrar
      return 'cancelled'
    }
  }

  try {
    await navigator.clipboard.writeText([text, url].filter(Boolean).join('\n\n'))

    return 'copied'
  } catch {
    return 'failed'
  }
}
