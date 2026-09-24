# Modo Cozinha

App de receitas que ajusta as porções, converte as medidas, gera a lista de compras e guia o preparo passo a passo com o celular na bancada.

> 🚧 **Em desenvolvimento.** Etapa atual: 0, planejamento e setup.

**Deploy:** _em breve_

## Stack

React 19, TypeScript, Vite, Sass (CSS Modules), React Router, TanStack Query, Zustand, Zod, Vitest, Testing Library e MSW. As receitas vêm da API pública [TheMealDB](https://www.themealdb.com).

## Como rodar

Requer Node.js 24.

```bash
npm install
npm run dev
```

| Script               | O que faz                                                |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento                              |
| `npm run build`      | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run lint`       | ESLint, incluindo a regra de dependência entre camadas   |
| `npm run format`     | Formata o código com Prettier                            |
| `npm run typecheck`  | Verifica os tipos com TypeScript                         |
| `npm test`           | Roda os testes uma vez                                   |
| `npm run test:watch` | Roda os testes a cada alteração                          |
| `npm run coverage`   | Roda os testes com relatório de cobertura                |

## Arquitetura

O código é organizado por funcionalidade em 6 camadas, e cada uma só usa as de baixo:

```
src/
├── app/        liga tudo: rotas e providers
├── pages/      as telas
├── widgets/    blocos grandes de tela
├── features/   o que o usuário FAZ (buscar, favoritar, ajustar porções...)
├── entities/   as COISAS do app (receita e medida)
└── shared/     genérico, serviria em qualquer app
```

O ESLint garante essa regra e o CI bloqueia o merge quando ela é violada.

- **Onde colocar cada código, com um exemplo passando pelas 6 camadas:** [src/README.md](src/README.md)
- **Por que essa arquitetura foi escolhida:** [docs/decisions/001-arquitetura-em-camadas.md](docs/decisions/001-arquitetura-em-camadas.md)

## Contribuindo

Cada funcionalidade nasce numa issue, é feita numa branch (`feat/rf01-busca`) com [Conventional Commits](https://www.conventionalcommits.org/pt-br/) e entra na `main` por pull request com o CI verde. Antes de cada commit, o Husky roda ESLint e Prettier nos arquivos alterados.

| Item                | Padrão                                  | Exemplo                                   |
| ------------------- | --------------------------------------- | ----------------------------------------- |
| Pastas de módulo    | kebab-case, em inglês                   | `favorite-recipe`, `recipe-details`       |
| Componentes         | PascalCase, um por arquivo              | `FavoriteButton.tsx`                      |
| Hooks               | camelCase com prefixo `use`             | `useServings.ts`                          |
| Stores Zustand      | camelCase terminado em `Store`          | `favoritesStore.ts` → `useFavoritesStore` |
| Funções puras       | camelCase com verbo                     | `parseMeasure`, `formatShoppingList`      |
| Tipos e interfaces  | PascalCase, sem prefixo `I`             | `Recipe`, `ParsedMeasure`                 |
| Constantes          | UPPER_SNAKE_CASE                        | `BASE_SERVINGS`                           |
| Estilos             | CSS Modules com o nome do componente    | `FavoriteButton.module.scss`              |
| Testes              | Mesmo nome do arquivo testado + `.test` | `parseMeasure.test.ts`                    |
| Textos da interface | Português do Brasil                     | "Adicionar à lista"                       |

## Licença

[MIT](LICENSE)
