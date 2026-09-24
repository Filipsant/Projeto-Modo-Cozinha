# features

O que o usuário **faz** no app. Cada feature é uma ação completa, com a própria interface, o próprio estado e a própria lógica.

| Módulo             | Ação do usuário                          | Etapa |
| ------------------ | ---------------------------------------- | ----- |
| `browse-recipes`   | Buscar e filtrar receitas                | 2 e 3 |
| `favorite-recipe`  | Favoritar e desfavoritar                 | 3     |
| `adjust-measures`  | Mudar as porções e as unidades de medida | 4     |
| `cooking-steps`    | Avançar e voltar os passos do preparo    | 5     |
| `kitchen-timers`   | Iniciar, pausar e ouvir os timers        | 5     |
| `screen-wake-lock` | Manter a tela ligada                     | 5     |
| `shopping-list`    | Montar e compartilhar a lista de compras | 6     |
| `theme-switcher`   | Trocar entre tema claro e escuro         | 7     |

**Pode importar:** entities e shared.

**Não pode importar:** app, pages, widgets nem outra feature. Quando duas features precisam trabalhar juntas, quem junta é a página ou um widget, passando dados por props.

## Estrutura de um módulo

Crie só as pastas que for usar:

```
favorite-recipe/
├── ui/         componentes: FavoriteButton.tsx
├── model/      estado: favoritesStore.ts e hooks
├── api/        chamadas à API, se houver
├── lib/        funções puras, sem React, com testes
└── index.ts    o que outros módulos podem usar
```
