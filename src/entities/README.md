# entities

As **coisas** do app: os conceitos que várias features usam. No Modo Cozinha são duas.

| Módulo    | O que tem                                                                                                  | Etapa |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----- |
| `recipe`  | Tipos `Recipe` e `RecipeSummary`, cliente da TheMealDB, validação com Zod, `RecipeCard` e `IngredientList` | 2     |
| `measure` | Parser de medidas, escala de porções, conversão para o sistema métrico e formatação                        | 4     |

Uma entity não sabe o que o usuário faz com ela. O `RecipeCard` mostra a receita, mas não sabe favoritar: ele recebe o botão de favorito pela prop `actions`.

**Pode importar:** outras entities (pelo `index.ts` delas) e shared.

**Não pode importar:** app, pages, widgets nem features.

Os módulos seguem a mesma estrutura das features: `ui/`, `model/`, `api/`, `lib/` e `index.ts`.
