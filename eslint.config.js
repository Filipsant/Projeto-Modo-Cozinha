import js from '@eslint/js'
import prettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/*
 * REGRA DE CAMADAS (explicada em src/README.md)
 *
 *   app → pages → widgets → features → entities → shared
 *
 * Cada camada só importa as que estão à direita dela. A tabela abaixo diz,
 * para cada camada, de quais ela NÃO pode importar. Quando a camada aparece
 * na própria lista, um módulo dela também não importa um módulo vizinho.
 */
const FORBIDDEN_IMPORTS = {
  app: [],
  pages: ['app', 'pages'],
  widgets: ['app', 'pages', 'widgets'],
  features: ['app', 'pages', 'widgets', 'features'],
  entities: ['app', 'pages', 'widgets', 'features'],
  shared: ['app', 'pages', 'widgets', 'features', 'entities'],
}

// Valem para todas as camadas: de fora de um módulo, só se entra pelo index.ts dele
const MODULE_BOUNDARIES = [
  {
    group: ['@/*/*/*'],
    message:
      'Importe pelo index.ts do módulo: @/entities/recipe, e não @/entities/recipe/ui/RecipeCard.',
  },
  {
    group: ['../../*'],
    message: 'Para sair do módulo, use o alias @/, por exemplo @/shared/ui.',
  },
]

// Pastas lib/ guardam só funções puras
const NO_REACT = [
  { name: 'react', message: 'Arquivos de lib/ são funções puras e não importam React.' },
  { name: 'react-dom', message: 'Arquivos de lib/ são funções puras e não importam React.' },
]

function importRules(layer, extraPaths = []) {
  const layerPatterns = FORBIDDEN_IMPORTS[layer].map((forbidden) => ({
    group: [`@/${forbidden}/*`],
    message:
      forbidden === layer
        ? `Um módulo de ${layer} não importa outro módulo de ${layer}; quem junta os dois é a camada de cima.`
        : `A camada ${layer} não pode importar ${forbidden}, que fica acima dela.`,
  }))

  return ['error', { paths: extraPaths, patterns: [...MODULE_BOUNDARIES, ...layerPatterns] }]
}

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // Regras recomendadas de JavaScript, TypeScript e React
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Regras de código do projeto
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Exportações nomeadas: renomear e buscar referências fica mais seguro
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      // Só o cliente da API faz requisições
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Componentes não chamam fetch; use o cliente da API em entities/*/api.',
        },
      ],
    },
  },
  {
    files: ['src/shared/lib/**', 'src/**/api/**'],
    rules: {
      'no-restricted-globals': 'off',
    },
  },

  // Regra de camadas: um bloco por camada
  { files: ['src/app/**'], rules: { 'no-restricted-imports': importRules('app') } },
  { files: ['src/pages/**'], rules: { 'no-restricted-imports': importRules('pages') } },
  { files: ['src/widgets/**'], rules: { 'no-restricted-imports': importRules('widgets') } },
  { files: ['src/features/**'], rules: { 'no-restricted-imports': importRules('features') } },
  { files: ['src/entities/**'], rules: { 'no-restricted-imports': importRules('entities') } },
  { files: ['src/shared/**'], rules: { 'no-restricted-imports': importRules('shared') } },
  {
    files: ['src/features/*/lib/**'],
    rules: { 'no-restricted-imports': importRules('features', NO_REACT) },
  },
  {
    files: ['src/entities/*/lib/**'],
    rules: { 'no-restricted-imports': importRules('entities', NO_REACT) },
  },

  prettier,
])
