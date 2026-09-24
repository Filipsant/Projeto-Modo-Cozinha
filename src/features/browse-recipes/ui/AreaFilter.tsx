import { useMemo } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Combobox } from '@/shared/ui'
import { useBrowseParams } from '../model/useBrowseParams'
import { useCatalogFacets } from '../model/useCatalogFacets'

interface AreaFilterProps {
  className?: string
}

export function AreaFilter({ className }: AreaFilterProps) {
  const { t } = useTranslation()
  const { area, setArea } = useBrowseParams()
  const { areas } = useCatalogFacets()

  // Os 63 países cabem aqui porque a busca do combobox filtra a lista
  const options = useMemo(
    () => areas.map(({ value, count }) => ({ value, label: t(`areas.${value}`, value), count })),
    [areas, t],
  )

  return (
    <Combobox
      className={className}
      label={t('home.originLabel')}
      placeholder={t('home.allRegions')}
      options={options}
      value={area}
      onChange={setArea}
    />
  )
}
