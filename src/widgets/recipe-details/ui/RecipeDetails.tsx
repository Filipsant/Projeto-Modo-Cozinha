import { ArrowRight, ChefHat, HandPlatter, Sparkles, Users, UtensilsCrossed } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  RecipeHero,
  RecipeStats,
  RecipeSteps,
  describeSteps,
  useDurationLabel,
  type Recipe,
} from '@/entities/recipe'
import { SERVINGS_PARAM, ServingsStepper, useServings } from '@/features/adjust-servings'
import { FavoriteButton } from '@/features/favorite-recipe'
import { IngredientChecklist } from '@/features/ingredient-checklist'
import { MeasureSystemToggle, useMeasureSystem } from '@/features/measure-system'
import { ShareButton } from '@/features/share-recipe'
import { AddToShoppingList } from '@/features/shopping-list'
import { QuickTimer, TimerAlarm } from '@/features/step-timer'
import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { ButtonLink, Callout } from '@/shared/ui'
import styles from './RecipeDetails.module.scss'

interface RecipeDetailsProps {
  recipe: Recipe
}

// Esquerda: a receita e as ações, como começar a cozinhar. Direita: o que ela usa
// enquanto cozinha, os ingredientes (com porções e medidas no mesmo cartão) e os passos.
export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const { t } = useTranslation()
  const [servings] = useServings()
  const system = useMeasureSystem()
  const navigate = useNavigate()
  const durationLabel = useDurationLabel()
  // O modo cozinha abre com as mesmas porções escolhidas aqui
  const cookingSearch = servings === BASE_SERVINGS ? '' : `?${SERVINGS_PARAM}=${servings}`
  // O cronômetro rápido fica com o passo mais demorado que cita tempo
  const longestStep = useMemo(
    () =>
      describeSteps(recipe)
        .filter((step) => step.minutes !== null)
        .sort((a, b) => (b.minutes ?? 0) - (a.minutes ?? 0))[0],
    [recipe],
  )

  function goToStep(step: number) {
    const search = new URLSearchParams(cookingSearch)
    search.set('passo', String(step))
    navigate(`/receita/${recipe.id}/cozinhar?${search.toString()}`)
  }

  return (
    <article className={styles.page}>
      <div className={styles.topbar}>
        <RecipeBreadcrumb recipe={recipe} />

        <div className={styles.tools}>
          <span className={styles.badge}>
            <Sparkles size={14} aria-hidden="true" />
            {t('recipeDetails.countertopBadge')}
          </span>
          <FavoriteButton recipe={recipe} icon="bookmark" />
          <ShareButton title={recipe.name} />
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.aside}>
          <RecipeHero recipe={recipe} />
          <RecipeStats recipe={recipe} />

          <ButtonLink
            to={`/receita/${recipe.id}/cozinhar${cookingSearch}`}
            size="cooking"
            className={styles.start}
            icon={<ChefHat size={24} aria-hidden="true" />}
          >
            <span className={styles.startLabel}>{t('recipeDetails.startCooking')}</span>
            <ArrowRight size={22} aria-hidden="true" />
          </ButtonLink>

          <AddToShoppingList recipe={recipe} servings={servings} system={system} />

          <Callout
            className={styles.tip}
            icon={<HandPlatter size={20} />}
            title={t('recipeDetails.tipTitle')}
          >
            {t('recipeDetails.tipText')}
          </Callout>
        </div>

        <div className={styles.main}>
          <IngredientChecklist
            key={recipe.id}
            ingredients={recipe.ingredients}
            servings={servings}
            system={system}
            controls={<RecipeAdjustments />}
          />
          <RecipeSteps recipe={recipe} />

          {longestStep?.minutes ? (
            <QuickTimer
              recipeId={recipe.id}
              step={longestStep.number}
              minutes={longestStep.minutes}
              description={t('recipeDetails.quickTimerText', {
                duration: durationLabel(longestStep.minutes),
                number: longestStep.number,
              })}
            />
          ) : null}
        </div>
      </div>

      {/* O timer disparado aqui também toca aqui, e leva ao passo no modo cozinha */}
      <TimerAlarm onGoToStep={goToStep} />
    </article>
  )
}

// Porções e sistema de medidas, dentro do cartão dos ingredientes: lado a lado
// quando cabe, um embaixo do outro no celular
function RecipeAdjustments() {
  const { t } = useTranslation()

  return (
    <div className={styles.adjust}>
      <div className={styles.adjustGrid}>
        <div className={styles.adjustItem}>
          <span id="titulo-rendimento" className={styles.adjustLabel}>
            <Users size={16} aria-hidden="true" />
            {t('recipeDetails.yieldTitle')}
          </span>
          <ServingsStepper labelledBy="titulo-rendimento" />
        </div>
        <MeasureSystemToggle className={styles.system} />
      </div>
    </div>
  )
}

// Receitas / origem (ou categoria) / nome: o link do meio volta para a busca já filtrada
function RecipeBreadcrumb({ recipe }: RecipeDetailsProps) {
  const { t } = useTranslation()
  const parent = recipe.area
    ? {
        to: `/?origem=${encodeURIComponent(recipe.area)}`,
        label: t(`areas.${recipe.area}`, recipe.area),
      }
    : recipe.category
      ? {
          to: `/?categoria=${encodeURIComponent(recipe.category)}`,
          label: t(`categories.${recipe.category}`, recipe.category),
        }
      : null

  return (
    <nav aria-label={t('recipeDetails.breadcrumbLabel')}>
      <ol className={styles.breadcrumb} role="list">
        <li>
          <Link to="/" className={styles.crumbRoot}>
            <UtensilsCrossed size={16} aria-hidden="true" />
            {t('recipeDetails.breadcrumbRoot')}
          </Link>
        </li>
        {parent ? (
          <li>
            <Link to={parent.to} className={styles.crumb}>
              {parent.label}
            </Link>
          </li>
        ) : null}
        <li>
          <span className={styles.crumbCurrent} aria-current="page">
            {recipe.name}
          </span>
        </li>
      </ol>
    </nav>
  )
}
