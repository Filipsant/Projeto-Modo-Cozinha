import { ArrowDownAZ, ArrowDownUp, Clock, Search, Timer } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import {
  FAVORITES_VIEWS,
  selectFavorites,
  useCompletePartialFavorites,
  useFavoritesStore,
  type FavoritesView,
} from '@/features/favorite-recipe'
import { useTranslation } from '@/shared/i18n'
import { Card, Chip, IconButton, Input } from '@/shared/ui'
import { FavoriteRecipes } from '@/widgets/favorite-recipes'
import styles from './FavoritesPage.module.scss'

const VIEW_ICONS: Record<FavoritesView, ReactNode> = {
  recent: <Clock size={16} aria-hidden="true" />,
  alphabetical: <ArrowDownAZ size={16} aria-hidden="true" />,
  quick: <Timer size={16} aria-hidden="true" />,
}

export function FavoritesPage() {
  const { t } = useTranslation()
  const items = useFavoritesStore((state) => state.items)
  const [term, setTerm] = useState('')
  const [view, setView] = useState<FavoritesView>('recent')
  const [reversed, setReversed] = useState(false)
  const visible = useMemo(
    () => selectFavorites(items, { term, view, reversed }),
    [items, term, view, reversed],
  )

  useCompletePartialFavorites()

  function showAll() {
    setTerm('')
    setView('recent')
    setReversed(false)
  }

  return (
    <div className={styles.page}>
      <Card className={styles.hero}>
        <div className={styles.titleRow}>
          {/* A contagem fica fora do h1: o título da página é só "Receitas Favoritas" */}
          <div className={styles.title}>
            <h1>{t('favorites.title')}</h1>
            <span className={styles.count}>
              {t('favorites.savedCount', { count: items.length })}
            </span>
          </div>

          <IconButton
            variant="surface"
            label={t('favorites.reverse')}
            aria-pressed={reversed}
            className={reversed ? styles.reverseActive : undefined}
            onClick={() => setReversed((current) => !current)}
          >
            <ArrowDownUp size={18} aria-hidden="true" />
          </IconButton>
        </div>

        <p className={styles.description}>{t('favorites.description')}</p>

        <div className={styles.controls}>
          <Input
            type="search"
            className={styles.search}
            label={t('favorites.searchLabel')}
            labelVisible={false}
            placeholder={t('favorites.searchPlaceholder')}
            icon={<Search size={20} />}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onClear={() => setTerm('')}
          />

          <div className={styles.views} role="group" aria-label={t('favorites.viewLabel')}>
            {FAVORITES_VIEWS.map((option) => (
              <Chip key={option} selected={view === option} onClick={() => setView(option)}>
                {VIEW_ICONS[option]}
                {t(`favorites.view_${option}`)}
              </Chip>
            ))}
          </div>
        </div>
      </Card>

      {/* Quantas sobraram depois da busca, para quem usa leitor de tela (RNF06) */}
      <p className={styles.status} role="status">
        {items.length > 0 ? t('home.resultsFound', { count: visible.length }) : null}
      </p>

      <FavoriteRecipes recipes={visible} hasFavorites={items.length > 0} onShowAll={showAll} />
    </div>
  )
}
