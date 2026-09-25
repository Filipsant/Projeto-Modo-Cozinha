import { Scale } from 'lucide-react'
import type { MeasureSystem } from '@/entities/recipe'
import { useTranslation } from '@/shared/i18n'
import { SegmentedControl } from '@/shared/ui'
import { useMeasureSystemStore } from '../model/measureSystemStore'

interface MeasureSystemToggleProps {
  className?: string
}

export function MeasureSystemToggle({ className }: MeasureSystemToggleProps) {
  const { t } = useTranslation()
  const system = useMeasureSystemStore((state) => state.system)
  const setSystem = useMeasureSystemStore((state) => state.setSystem)

  return (
    <SegmentedControl<MeasureSystem>
      className={className}
      label={t('measureSystem.label')}
      icon={<Scale size={16} />}
      options={[
        { value: 'metric', label: t('measureSystem.metric') },
        { value: 'original', label: t('measureSystem.original') },
      ]}
      value={system}
      onChange={setSystem}
    />
  )
}
