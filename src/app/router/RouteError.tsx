import { Link } from 'react-router'

export function RouteError() {
  return (
    <main>
      <h1>Algo deu errado</h1>
      <p>Tente recarregar a página ou volte para o início.</p>
      <Link to="/">Voltar para o início</Link>
    </main>
  )
}
