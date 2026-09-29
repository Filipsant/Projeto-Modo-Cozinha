import { Expand, Hand } from 'lucide-react'
import {
  AreaFilter,
  CategoryFilter,
  DifficultyFilter,
  SearchBar,
  useBrowseParams,
  useRecipeResults,
} from '@/features/browse-recipes'
import { OfflineReadyBadge } from '@/features/app-update'
import { useTranslation } from '@/shared/i18n'
import { Callout, Card } from '@/shared/ui'
import { RecipeResults } from '@/widgets/recipe-results'
import { TrendingRecipes } from '@/widgets/trending-recipes'
import styles from './HomePage.module.scss'

export function HomePage() {
  const { t } = useTranslation()
  const { hasFilters, clearFilters } = useBrowseParams()
  const { recipes, isPending, isError, refetch } = useRecipeResults()

  return (
    <div className={styles.pagina}>
      <Card className={styles.hero}>
        <div className={styles.selos}>
          <p className={styles.selo}>
            <Hand size={14} aria-hidden="true" />
            {t('home.badge')}
          </p>
          <OfflineReadyBadge />
        </div>

        <h1 className={styles.titulo}>{t('home.title')}</h1>
        <p className={styles.descricao}>{t('home.description')}</p>

        <div className={styles.controles}>
          <SearchBar className={styles.busca} />
          <CategoryFilter className={styles.filtro} />
          <AreaFilter className={styles.filtro} />
          <DifficultyFilter className={styles.filtro} />
        </div>
      </Card>

      {/* Vitrine só na home sem busca: com um filtro ativo, o que importa é o resultado */}
      {hasFilters ? null : <TrendingRecipes exploreHref="#receitas" />}

      <section id="receitas" className={styles.resultados} aria-labelledby="titulo-resultados">
        <div className={styles.resultadosCabecalho}>
          <div>
            <h2 id="titulo-resultados" className={styles.resultadosTitulo}>
              {t('home.resultsTitle')}
            </h2>
            <p className={styles.resultadosSubtitulo}>{t('home.resultsSubtitle')}</p>
          </div>

          {/* O leitor de tela precisa saber quantas receitas sobraram (RNF06) */}
          <p
            className={recipes?.length === 0 ? styles.contadorOculto : styles.contador}
            role="status"
          >
            {recipes ? t('home.resultsFound', { count: recipes.length }) : null}
          </p>
        </div>

        <RecipeResults
          recipes={recipes}
          isPending={isPending}
          isError={isError}
          onRetry={() => void refetch()}
          onClearSearch={clearFilters}
        />
      </section>

      <Callout icon={<Expand size={20} />} title={t('home.tipTitle')}>
        {t('home.tipText')}
      </Callout>
    </div>
  )
}
