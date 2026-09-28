# shared

Código genérico, que serviria em qualquer outro app. Nada aqui sabe o que é uma receita.

**Para decidir:** se o código funcionaria sem mudanças num app de filmes, ele pertence a shared.

| Segmento  | O que tem                                                                     | Etapa |
| --------- | ----------------------------------------------------------------------------- | ----- |
| `ui`      | Componentes base: `Button`, `IconButton`, `Input`, `Chip`, `Spinner`, `Toast` | 1     |
| `styles`  | Design tokens e mixins do Sass                                                | 1     |
| `lib`     | Funções e hooks genéricos: `fetchJson`, `useDebounce`, `clamp`                | 2     |
| `config`  | Constantes: URL da API, porções base e limites                                | 2     |
| `api`     | Clientes de serviços genéricos: `translateLines`, o tradutor dos passos       | 7     |
| `testing` | Configuração dos testes, servidor do MSW e `renderWithProviders`              | 0 ✅  |

**Pode importar:** só shared. Um segmento usa outro pelo `index.ts`, por exemplo `@/shared/lib`.
