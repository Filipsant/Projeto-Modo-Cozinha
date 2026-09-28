import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { recipeQueries } from '@/entities/recipe'
import { useClickCounts } from '@/features/recipe-clicks'
import { useTranslation } from '@/shared/i18n'
import { buildTrending } from '../lib/buildTrending'
import { TRENDING_TABS, type TrendingTabId } from '../model/trendingTabs'
import styles from './TrendingRecipes.module.scss'
import { TrendingCard } from './TrendingCard'

const SKELETON_COUNT = 6

interface TrendingRecipesProps {
  /** Para onde vai o "Explorar tudo": a lista completa, na mesma página. */
  exploreHref: string
}

// "Em alta na bancada": as receitas mais abertas neste aparelho nos últimos 7
// dias, em pôsteres com as ilustrações de traço do design. Escuro nos dois temas,
// como no design: a seção é uma vitrine, e não parte da lista
export function TrendingRecipes({ exploreHref }: TrendingRecipesProps) {
  const { t } = useTranslation()
  const id = useId()
  const railRef = useRef<HTMLOListElement>(null)
  const [tab, setTab] = useState<TrendingTabId>('all')
  const [edges, setEdges] = useState({ start: true, end: false })
  const catalog = useQuery(recipeQueries.catalog())
  const clicks = useClickCounts()

  const items = useMemo(() => {
    const matches = TRENDING_TABS.find((option) => option.id === tab)?.matches ?? (() => true)

    return catalog.data ? buildTrending(catalog.data.filter(matches), clicks) : []
  }, [catalog.data, clicks, tab])
  const maxClicks = Math.max(1, ...items.map((item) => item.clicks))
  const totalClicks = Object.values(clicks).reduce((sum, count) => sum + count, 0)

  // Sem o catálogo não há o que mostrar: a home segue sem a vitrine
  if (catalog.isError) return null

  function choose(next: TrendingTabId) {
    setTab(next)
    railRef.current?.scrollTo?.({ left: 0 })
    setEdges({ start: true, end: false })
  }

  // Padrão ARIA de abas: as setas trocam de aba, Home e End vão às pontas
  function handleTabKeys(event: KeyboardEvent<HTMLDivElement>) {
    const index = TRENDING_TABS.findIndex((option) => option.id === tab)
    const last = TRENDING_TABS.length - 1
    const target =
      event.key === 'ArrowRight'
        ? (index + 1) % TRENDING_TABS.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + TRENDING_TABS.length) % TRENDING_TABS.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null

    if (target === null) return

    event.preventDefault()
    choose(TRENDING_TABS[target].id)
    document.getElementById(`${id}-tab-${TRENDING_TABS[target].id}`)?.focus()
  }

  // O rolar suave vem do CSS, que o desliga para quem pediu menos movimento
  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current

    rail?.scrollBy?.({ left: direction * rail.clientWidth * 0.8 })
  }

  function updateEdges() {
    const rail = railRef.current

    if (!rail) return

    setEdges({
      start: rail.scrollLeft <= 4,
      end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4,
    })
  }

  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={t('trending.tabsLabel')}
        onKeyDown={handleTabKeys}
      >
        {TRENDING_TABS.map((option) => (
          <button
            key={option.id}
            id={`${id}-tab-${option.id}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={option.id === tab}
            aria-controls={`${id}-panel`}
            tabIndex={option.id === tab ? 0 : -1}
            onClick={() => choose(option.id)}
          >
            {t(`trending.tab_${option.id}`)}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.intro}>
          <span className={styles.kicker}>{t('trending.kicker')}</span>
          <h2 id={`${id}-title`} className={styles.title}>
            {t('trending.title')}
          </h2>
          <p className={styles.description}>
            {totalClicks > 0 ? t('trending.description') : t('trending.descriptionEmpty')}
          </p>
          <a href={exploreHref} className={styles.explore}>
            {t('trending.explore')}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div
          id={`${id}-panel`}
          className={styles.railWrap}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab}`}
        >
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrevious}`}
            aria-label={t('trending.previous')}
            aria-controls={`${id}-rail`}
            disabled={edges.start}
            onClick={() => scrollRail(-1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <ol
            ref={railRef}
            id={`${id}-rail`}
            className={styles.rail}
            role="list"
            aria-busy={catalog.isPending}
            onScroll={updateEdges}
          >
            {catalog.isPending
              ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <li key={index} className={styles.item} aria-hidden="true">
                    <span className={`${styles.poster} ${styles.skeleton}`} />
                  </li>
                ))
              : items.map((item) => (
                  <TrendingCard key={item.recipe.id} item={item} maxClicks={maxClicks} />
                ))}
          </ol>

          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            aria-label={t('trending.next')}
            aria-controls={`${id}-rail`}
            disabled={edges.end}
            onClick={() => scrollRail(1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className={styles.legend}>
        <span>
          {t('trending.periodLabel')} <b>{t('trending.periodValue')}</b>
        </span>
        <span>
          {t('trending.baseLabel')} <b>{t('trending.baseValue', { count: totalClicks })}</b>
        </span>
      </p>
    </section>
  )
}
