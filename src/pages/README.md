# pages

Uma pasta por tela do app. A página só **monta** a tela: lê os parâmetros da URL e junta widgets e features. A lógica fica nas camadas de baixo.

| Pasta            | Rota                    | Tela                    |
| ---------------- | ----------------------- | ----------------------- |
| `home`           | `/`                     | Início: busca e filtros |
| `recipe-details` | `/receita/:id`          | Detalhe da receita      |
| `cooking-mode`   | `/receita/:id/cozinhar` | Modo cozinha            |
| `favorites`      | `/favoritos`            | Favoritos               |
| `shopping-list`  | `/lista-de-compras`     | Lista de compras        |
| `not-found`      | qualquer outra          | Página não encontrada   |

**Pode importar:** widgets, features, entities e shared.

**Não pode importar:** app nem outra página.

## Estrutura de uma página

```
home/
├── HomePage.tsx
├── HomePage.module.scss
├── HomePage.test.tsx
└── index.ts            → export { HomePage } from './HomePage'
```

Para criar uma página nova, crie a pasta e adicione a rota em `app/router/router.tsx`.
