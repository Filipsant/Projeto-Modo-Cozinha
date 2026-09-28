import { FOOD_ILLUSTRATIONS, type FoodIllustrationName } from './illustrations'

interface FoodIllustrationProps {
  name: FoodIllustrationName
  className?: string
  /** Largura do traço, na escala de 64: mais fino quando a ilustração fica grande. */
  strokeWidth?: number
}

// Decorativa: quem diz o que é a receita é o texto ao lado, e não o desenho
export function FoodIllustration({ name, className, strokeWidth = 2.4 }: FoodIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {FOOD_ILLUSTRATIONS[name]}
    </svg>
  )
}
