import { Button, Chip, IconButton } from '@/shared/ui'

export function HomePage() {
  return (
    <>
      <h1>Início</h1>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 24, alignItems: 'center' }}
      >
        <Button>Iniciar modo cozinha</Button>
        <Button variant="secondary">Ajustar doses</Button>
        <Button variant="ghost">Ver modo leitura</Button>
        <Button loading>Salvando</Button>
        <Button disabled>Indisponível</Button>
        <Button size="cooking">Próximo passo</Button>
        <Chip selected>Massas</Chip>
        <Chip>Sobremesas</Chip>
        <IconButton label="Adicionar aos favoritos" variant="surface">
          ♥
        </IconButton>
      </div>
    </>
  )
}
