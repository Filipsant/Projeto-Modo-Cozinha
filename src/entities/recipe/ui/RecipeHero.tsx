import { useTranslation } from '@/shared/i18n'
import type { Recipe } from '../model/recipe.types'
import styles from './RecipeHero.module.scss'

interface RecipeHeroProps {
  recipe: Recipe
}

// Foto grande com o título por cima, como no design. Nota e calorias ficaram de
// fora: a API não tem esses dados e decidimos não inventar.
export function RecipeHero({ recipe }: RecipeHeroProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.hero}>
      <img
        className={styles.photo}
        src={recipe.thumbnail}
        alt=""
        width={700}
        height={525}
        // É a maior imagem da tela: o navegador baixa antes das outras
        fetchPriority="high"
      />

      <div className={styles.overlay}>
        <p className={styles.badges}>
          {recipe.category ? (
            <span className={styles.category}>
              {t(`categories.${recipe.category}`, recipe.category)}
            </span>
          ) : null}
          {recipe.area ? (
            <span className={styles.area}>{t(`areas.${recipe.area}`, recipe.area)}</span>
          ) : null}
        </p>

        <h1 className={styles.title}>{recipe.name}</h1>

        <p className={styles.summary}>
          {t('common.ingredients', { count: recipe.ingredients.length })} ·{' '}
          {t('common.steps', { count: recipe.steps.length })}
        </p>
      </div>
    </div>
  )
}
