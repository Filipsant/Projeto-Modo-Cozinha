import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import { useDebounce } from '@/shared/lib'
import { Input } from '@/shared/ui'
import { useBrowseParams } from '../model/useBrowseParams'

/** RF01: a busca dispara 400 ms depois que o usuário para de digitar. */
const DEBOUNCE_MS = 400

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation()
  const { term, setTerm } = useBrowseParams()
  // O campo responde na hora; quem espera é a URL, e com ela a requisição
  const [draft, setDraft] = useState(term)
  const debounced = useDebounce(draft, DEBOUNCE_MS)

  useEffect(() => {
    setTerm(debounced)
    // setTerm vem do useSearchParams e muda a cada render; o que importa aqui
    // é reagir ao valor com atraso
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return (
    <Input
      className={className}
      label={t('home.searchLabel')}
      labelVisible={false}
      icon={<Search size={18} aria-hidden="true" />}
      placeholder={t('home.searchPlaceholder')}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onClear={() => setDraft('')}
      type="search"
    />
  )
}
