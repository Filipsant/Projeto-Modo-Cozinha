import { useMemo } from 'react'
import { useTranslation } from '@/shared/i18n'
import { Combobox } from '@/shared/ui'
import { useBrowseParams } from '../model/useBrowseParams'
import { useCatalogFacets } from '../model/useCatalogFacets'

interface DifficultyFilterProps {
  className?: string
}

// Os mesmos Fácil, Médio e Difícil das tags dos cartões, ao lado de categoria e origem
export function DifficultyFilter({ className }: DifficultyFilterProps) {
  const { t } = useTranslation()
  const { difficulty, setDifficulty } = useBrowseParams()
  const { difficulties } = useCatalogFacets()

  const options = useMemo(
    () =>
      difficulties.map(({ value, count }) => ({
        value,
        label: t(`recipe.difficulty_${value}`),
        count,
      })),
    [difficulties, t],
  )

  return (
    <Combobox
      className={className}
      label={t('home.difficultyLabel')}
      placeholder={t('home.allDifficulties')}
      options={options}
      value={difficulty}
      onChange={setDifficulty}
    />
  )
}
