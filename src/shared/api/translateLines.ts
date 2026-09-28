import { z } from 'zod'
import { TRANSLATE_URL } from '@/shared/config'
import { fetchJson } from '@/shared/lib'

// O tradutor devolve [[["tradução", "original", ...], ...], null, "en", ...]:
// só o primeiro item importa, com um pedaço traduzido por frase
const responseDto = z.tuple([z.array(z.tuple([z.string().nullable()], z.unknown()))], z.unknown())

/** Teto do texto na URL, já codificado: com folga, porque URLs longas demais são recusadas. */
const MAX_QUERY_LENGTH = 5000

interface TranslateOptions {
  from: string
  to: string
  signal?: AbortSignal
}

/**
 * Traduz uma lista de linhas mantendo cada uma no seu lugar: a linha 3 traduzida
 * é a tradução da linha 3. É por GET, e não POST, para o service worker guardar
 * a resposta e a tradução continuar aparecendo offline.
 */
export async function translateLines(
  lines: string[],
  options: TranslateOptions,
): Promise<string[]> {
  if (lines.length === 0) return []

  const chunks = await Promise.all(chunkLines(lines).map((chunk) => translateChunk(chunk, options)))

  return chunks.flat()
}

// Cada linha vira uma quebra de linha no texto enviado, e o tradutor preserva as
// quebras. Se um dia ele juntar ou partir alguma, traduzimos linha a linha para
// nenhum passo ficar com o texto do vizinho
async function translateChunk(lines: string[], options: TranslateOptions): Promise<string[]> {
  const translated = (await translateText(lines.join('\n'), options)).split('\n')

  if (translated.length === lines.length) return translated.map((line) => line.trim())

  return Promise.all(lines.map(async (line) => (await translateText(line, options)).trim()))
}

async function translateText(text: string, { from, to, signal }: TranslateOptions) {
  const data = await fetchJson(buildUrl(text, from, to), { signal })
  const [sentences] = responseDto.parse(data)

  return sentences.map(([sentence]) => sentence ?? '').join('')
}

function buildUrl(text: string, from: string, to: string): string {
  const params = new URLSearchParams({ client: 'gtx', sl: from, tl: to, dt: 't', q: text })

  return `${TRANSLATE_URL}?${params.toString()}`
}

// Junta linhas até perto do teto da URL. Uma linha maior que o teto vai sozinha
function chunkLines(lines: string[]): string[][] {
  const chunks: string[][] = []
  let current: string[] = []
  let length = 0

  for (const line of lines) {
    const encoded = encodeURIComponent(`${line}\n`).length

    if (current.length > 0 && length + encoded > MAX_QUERY_LENGTH) {
      chunks.push(current)
      current = []
      length = 0
    }

    current.push(line)
    length += encoded
  }

  chunks.push(current)

  return chunks
}
