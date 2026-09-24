# app

Liga o aplicativo inteiro. É a única camada que conhece todas as outras.

| Arquivo ou pasta | O que faz                                                   | Etapa |
| ---------------- | ----------------------------------------------------------- | ----- |
| `main.tsx`       | Ponto de entrada, carregado pelo `index.html`               | 0 ✅  |
| `providers/`     | Providers globais; hoje, o do TanStack Query                | 0 ✅  |
| `router/`        | A lista de rotas e a tela de erro inesperado (`RouteError`) | 0 ✅  |
| `styles/`        | Estilos globais: reset, fonte base e foco visível           | 1     |

**Pode importar:** todas as outras camadas.

**Não entra aqui:** telas (vão em `pages`) e regras de negócio (vão em `features` ou `entities`).
