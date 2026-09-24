// Primeiro dos três níveis de tratamento de erro: falha de rede vira um tipo
// nosso, com status, para a tela poder distinguir "não encontrada" de "deu ruim".
export class HttpError extends Error {
  readonly status: number
  readonly url: string

  constructor(status: number, url: string) {
    super(`A requisição para ${url} falhou com status ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.url = url
  }
}
