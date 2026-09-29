# Modo Cozinha

App de receitas que ajusta as porções, converte as medidas, gera a lista de compras e guia o preparo passo a passo com o celular na bancada.

> ✅ **Roadmap concluído**: etapas 0 a 7.

**Deploy:** _em breve_

## O que o app faz

- **Busca no catálogo inteiro:** as 790 receitas da API, filtradas por nome, ingrediente, categoria, origem e dificuldade. A busca da TheMealDB para em 25 resultados; o app contorna isso montando o catálogo letra por letra.
- **Em alta na bancada:** vitrine na home com as receitas mais abertas neste aparelho nos últimos 7 dias, por categoria, em pôsteres de vidro com ilustrações de traço, sobre uma luz em movimento. Sem cliques ainda, mostra sugestões do catálogo.
- **Detalhe da receita:**
  - porções de 1 a 20, guardadas na URL (`?porcoes=6`)
  - medidas convertidas para g/ml ou mantidas nas unidades originais, em frações de medidor ("¾ xícara")
  - lista de ingredientes para marcar
  - passos com o tempo e os ingredientes que cada um cita, traduzidos para o português
  - lista de compras com os ingredientes que você escolher, sem o que já tem em casa
- **Modo Cozinha:**
  - um passo por vez, em letra grande, com botões de 64 px e as setas do teclado
  - timers por passo que continuam correndo ao avançar e tocam alarme
  - a tela fica acesa enquanto você cozinha
  - ao concluir, volta para o início com um aviso de "Concluído!"
- **Favoritos:** busca, ordenação e "Desfazer" ao remover.
- **Lista de compras:** agrupada por receita ou por corredor do mercado, com progresso e compartilhamento em texto.
- **PWA:** instala no celular e abre sem internet as receitas já vistas, os favoritos e a lista.
- **Temas e idiomas:** tema claro e escuro, português e inglês.

A API não informa tempo de preparo, dificuldade, método nem o corredor de cada ingrediente. O app deduz esses dados do texto da receita. O leitor de medidas entende 97,9% das 8.152 medidas reais do catálogo.

A TheMealDB só tem receitas em inglês. Com a interface em português, os passos são traduzidos pelo tradutor público do Google (sem chave) e guardados em cache, então a receita já vista continua traduzida offline. Sem conexão com o tradutor, os passos aparecem em inglês com um aviso. Nomes de ingredientes e medidas usam um dicionário próprio.

## Stack

React 19, TypeScript, Vite, Sass (CSS Modules), React Router, TanStack Query, Zustand, Zod, react-i18next, vite-plugin-pwa (Workbox), Vitest, Testing Library e MSW. As receitas vêm da API pública [TheMealDB](https://www.themealdb.com).

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
| `npm run preview`    | Serve o build de `dist/`, com o service worker ativo     |

O service worker só existe no build, para o cache não atrapalhar o desenvolvimento. Para testar o modo offline:

1. Rode `npm run build && npm run preview`.
2. Abra o app e uma receita.
3. Marque "Offline" na aba Network do DevTools e recarregue a página.

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
| Textos da interface | Chaves do i18n, em português e inglês   | `t('shopping.add')`                       |

## Licença

[MIT](LICENSE)
