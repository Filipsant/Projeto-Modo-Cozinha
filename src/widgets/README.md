# widgets

Blocos grandes de tela, que funcionam sozinhos e juntam várias features e entities.

**Para decidir:** se o bloco só exibe uma coisa, ele é um componente de entity ou de feature. Se ele **junta** várias peças num pedaço grande da tela, é um widget.

| Módulo           | O que junta                                                                          | Etapa |
| ---------------- | ------------------------------------------------------------------------------------ | ----- |
| `app-layout`     | Cabeçalho, navegação, contador da lista de compras, rodapé e "Pular para o conteúdo" | 1     |
| `recipe-results` | Grade de `RecipeCard` com `FavoriteButton` e os estados de carregando, erro e vazio  | 2     |

**Pode importar:** features, entities e shared.

**Não pode importar:** app, pages nem outro widget.

Cada widget tem uma pasta `ui/` e um `index.ts` com o que ele exporta.
