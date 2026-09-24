# Como o código está organizado

O código fica em 6 camadas. Pense nelas como os andares de um prédio: cada andar só usa os andares **de baixo**.

```
app        liga tudo: rotas e providers
 ↓
pages      as telas
 ↓
widgets    blocos grandes de tela
 ↓
features   o que o usuário FAZ (buscar, favoritar, ajustar porções...)
 ↓
entities   as COISAS do app (receita e medida)
 ↓
shared     genérico, serviria em qualquer app
```

O ESLint confere essa regra: um import "para cima" quebra o `npm run lint` e o CI, com uma mensagem explicando o erro.

## Onde coloco esse código?

Responda de cima para baixo e pare no primeiro "sim":

1. Serviria em qualquer outro app, sem mudar nada (um botão, um `useDebounce`)? → **shared**
2. Descreve uma coisa do app, receita ou medida (um tipo, a busca na API, um cálculo, o card)? → **entities**
3. É uma ação que o usuário faz (favoritar, iniciar um timer, adicionar à lista)? → **features**
4. É um bloco grande de tela que junta várias features e entities? → **widgets**
5. É uma tela inteira, ligada a uma rota? → **pages**
6. Configura o app todo (rotas, providers, estilos globais)? → **app**

## Exemplo: favoritar uma receita na busca

Uma mesma tela passa por todas as camadas, cada uma com um papel só:

| Camada   | Arquivo                                 | Papel                                                       |
| -------- | --------------------------------------- | ----------------------------------------------------------- |
| shared   | `ui/IconButton.tsx`                     | Botão com ícone, genérico                                   |
| entities | `recipe/ui/RecipeCard.tsx`              | Mostra a receita e recebe botões extras pela prop `actions` |
| features | `favorite-recipe/ui/FavoriteButton.tsx` | O coração que favorita, usando o `favoritesStore`           |
| widgets  | `recipe-results/ui/RecipeResults.tsx`   | A grade de cards; coloca um `FavoriteButton` em cada card   |
| pages    | `home/HomePage.tsx`                     | Junta a barra de busca e a grade de resultados              |
| app      | `router/router.tsx`                     | Liga a rota `/` à `HomePage`                                |

Repare que o `RecipeCard` não conhece o `FavoriteButton`: quem coloca um dentro do outro é o widget. Assim cada peça pode ser testada e mudada sozinha.

## As três regras de import

1. **Só para baixo:** uma camada nunca importa uma camada acima dela.
2. **Pela porta da frente:** de fora de um módulo, importe só o `index.ts` dele.
   - ✅ `import { RecipeCard } from '@/entities/recipe'`
   - ❌ `import { RecipeCard } from '@/entities/recipe/ui/RecipeCard'`
3. **Vizinhos não se importam:** uma feature não importa outra feature, e o mesmo vale para pages e widgets. Quem junta as duas é a camada de cima.

Dentro do próprio módulo, use imports relativos (`../model/favoritesStore`).

## Guia de cada camada

[app](app/README.md) · [pages](pages/README.md) · [widgets](widgets/README.md) · [features](features/README.md) · [entities](entities/README.md) · [shared](shared/README.md)
