import { useMemo } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Combobox } from '@/shared/ui'
import { useBrowseParams } from '../model/useBrowseParams'
import { useCatalogFacets } from '../model/useCatalogFacets'

interface CategoryFilterProps {
  className?: string
}

export function CategoryFilter({ className }: CategoryFilterProps) {
  const { t } = useTranslation()
  const { category, setCategory } = useBrowseParams()
  const { categories } = useCatalogFacets()

  // O rótulo é o texto traduzido, e é por ele que o combobox busca
  const options = useMemo(
    () =>
      categories.map(({ value, count }) => ({
        value,
        label: t(`categories.${value}`, value),
        count,
      })),
    [categories, t],
  )

  return (
    <Combobox
      className={className}
      label={t('home.categoriesLabel')}
      placeholder={t('home.allCategories')}
      options={options}
      value={category}
      onChange={setCategory}
    />
  )
}
