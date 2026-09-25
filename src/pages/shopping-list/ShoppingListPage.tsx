import { ArrowRight, BookOpen, Gift, ShoppingBasket, Store } from 'lucide-react'
import { useState } from 'react'
import { useMeasureSystem } from '@/features/measure-system'
import { ShoppingListActions, useShoppingListStore } from '@/features/shopping-list'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, Callout, Card, EmptyState, SegmentedControl } from '@/shared/ui'
import { ShoppingListBoard, type ShoppingGrouping } from '@/widgets/shopping-list-board'
import styles from './ShoppingListPage.module.scss'

export function ShoppingListPage() {
  const { t } = useTranslation()
  const system = useMeasureSystem()
  const [grouping, setGrouping] = useState<ShoppingGrouping>('recipe')
  const total = useShoppingListStore((state) => state.items.length)
  const done = useShoppingListStore((state) => state.items.filter((item) => item.bought).length)
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className={styles.page}>
      <Card className={styles.hero}>
        <div className={styles.headRow}>
          <div>
            <p className={styles.eyebrow}>{t('shopping.eyebrow')}</p>
            <h1>{t('shopping.title')}</h1>
          </div>
          <span className={styles.pending}>
            <ShoppingBasket size={16} aria-hidden="true" />
            {t('shopping.pending', { count: total - done })}
          </span>
        </div>

        {total > 0 ? (
          <>
            <div className={styles.progressBlock}>
              <progress
                className={styles.progress}
                max={total}
                value={done}
                aria-label={t('shopping.progressLabel')}
              />
              <div className={styles.progressText}>
                <span>{t('shopping.progress', { done, total })}</span>
                <span className={styles.percent}>{t('shopping.percent', { percent })}</span>
              </div>
            </div>

            <div className={styles.controls}>
              <SegmentedControl<ShoppingGrouping>
                className={styles.grouping}
                label={t('shopping.groupLabel')}
                options={[
                  {
                    value: 'recipe',
                    label: t('shopping.byRecipe'),
                    icon: <BookOpen size={16} />,
                  },
                  { value: 'aisle', label: t('shopping.byAisle'), icon: <Store size={16} /> },
                ]}
                value={grouping}
                onChange={setGrouping}
              />
              <ShoppingListActions system={system} />
            </div>
          </>
        ) : null}
      </Card>

      {total > 0 ? (
        <>
          <ShoppingListBoard grouping={grouping} system={system} />
          <Callout icon={<Gift size={20} />} title={t('shopping.tipTitle')}>
            {t('shopping.tipText')}
          </Callout>
        </>
      ) : (
        <EmptyState
          icon={<ShoppingBasket size={28} />}
          title={t('shopping.emptyTitle')}
          description={t('shopping.emptyDescription')}
          action={
            <ButtonLink to="/" icon={<ArrowRight size={18} aria-hidden="true" />}>
              {t('shopping.emptyAction')}
            </ButtonLink>
          }
        />
      )}
    </div>
  )
}
