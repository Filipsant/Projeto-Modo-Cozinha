# 001: Arquitetura em camadas por funcionalidade

- **Status:** aceita
- **Data:** 18/09/2026

## Contexto

O Modo Cozinha vai crescer ao longo de 8 etapas: busca, filtros, favoritos, porções, modo cozinha, timers e lista de compras. Organizar o código por tipo de arquivo (`components/`, `hooks/`, `utils/` na raiz) funciona no começo, mas mistura assuntos diferentes na mesma pasta e deixa qualquer arquivo importar qualquer outro. Conforme o app cresce, uma mudança numa funcionalidade passa a quebrar outras, e fica difícil dizer onde um código novo deve morar.

Também é preciso que as regras de organização sejam verificadas por ferramenta, e não só por disciplina, para continuarem valendo quando houver pressa.

## Decisão

Organizar `src/` por funcionalidade em 6 camadas, inspiradas no Feature-Sliced Design e no Bulletproof React. As camadas estão em ordem: cada uma só importa as que vêm depois dela.

| Camada     | Responsabilidade                                                     | Pode importar                               |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------- |
| `app`      | Inicializar o app: providers, rotas, tela de erro e estilos globais  | Todas as abaixo                             |
| `pages`    | Montar cada tela combinando widgets e features                       | widgets, features, entities e shared        |
| `widgets`  | Blocos de tela reutilizáveis que juntam várias peças                 | features, entities e shared                 |
| `features` | Uma ação de valor para o usuário, com UI, estado e lógica próprios   | entities e shared                           |
| `entities` | Conceitos do negócio (`recipe`, `measure`): tipos, API, regras puras | outras entities (pela API pública) e shared |
| `shared`   | Código genérico, sem nenhuma regra do Modo Cozinha                   | Somente shared                              |

Regras:

1. Uma camada nunca importa uma camada acima dela.
2. Em `pages`, `widgets` e `features`, um módulo não importa outro módulo da mesma camada. Quem combina funcionalidades é a camada de cima, passando dados por props.
3. Todo módulo expõe uma API pública em `index.ts`. De fora, importa-se só `@/camada/modulo`, nunca um arquivo interno.
4. Dentro do módulo, os imports são relativos e sobem no máximo um nível (`../model/store`). Para sair do módulo, usa-se o alias `@/`.
5. Arquivos de `lib/` em `entities` e `features` são funções puras e não importam React.
6. Exportações nomeadas, sem `export default`, e nenhum componente chama `fetch`.

Todas essas regras estão em `eslint.config.js` (`no-restricted-imports`, `no-restricted-exports` e `no-restricted-globals`), e o CI bloqueia o merge quando alguma é violada.

## Consequências

**Positivas**

- Cada funcionalidade mora num lugar só, e dá para entender, testar ou apagar uma sem mexer nas outras.
- A regra de dependência é garantida pelo lint, com mensagens que explicam o erro.
- A lógica de negócio fica em funções puras, testáveis sem renderizar nada.

**Negativas**

- Há mais pastas e arquivos `index.ts` do que numa estrutura simples.
- Decidir a camada de um código novo exige pensar. Na dúvida, ele começa no módulo que o usa e desce para uma camada mais baixa quando outro módulo precisar dele.
- A regra confere o texto do import, não o arquivo resolvido: um import relativo de um nível entre segmentos de `shared` (`../lib/useDebounce`) não é barrado. Se isso virar problema, a alternativa é o `eslint-plugin-boundaries`.
