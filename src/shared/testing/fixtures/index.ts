// Respostas reais da TheMealDB, baixadas uma vez e versionadas: é o que permite
// rodar os testes sem internet. Exportadas aqui para entrar pela API pública do
// módulo (@/shared/testing), como manda a regra de imports.
import areas from './areas.json'
import categories from './categories.json'
import filterSeafood from './filter-seafood.json'
import lookupTeriyaki from './lookup-52772.json'
import searchChicken from './search-chicken.json'
import searchEmpty from './search-vazio.json'
import translateTeriyaki from './translate-52772.json'

export const fixtures = {
  /** lookup.php?i=52772 — receita completa, com vídeo e medidas em fração */
  lookupTeriyaki,
  /** search.php?s=chicken — 25 receitas, 3 delas sem vídeo */
  searchChicken,
  /** search.php?s=zzzzzz — o retorno { "meals": null } */
  searchEmpty,
  /** categories.php — as 14 categorias */
  categories,
  /** list.php?a=list — as origens */
  areas,
  /** filter.php?c=Seafood — só id, nome e foto */
  filterSeafood,
  /** Tradutor do Google: os 6 passos da 52772 em português, uma frase por item */
  translateTeriyaki: translateTeriyaki as [[string, string][], null, string],
}
