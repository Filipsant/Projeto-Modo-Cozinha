import { Outlet, ScrollRestoration } from 'react-router'

// Página nova abre do topo, e o voltar do navegador devolve a rolagem de antes.
// Sem isto, concluir a receita rolada até o fim abria o início lá embaixo
export function RootRoute() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
