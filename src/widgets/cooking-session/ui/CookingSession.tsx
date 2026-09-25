import { ChevronLeft, Sun } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { describeSteps, highlightIngredients, type Recipe } from '@/entities/recipe'
import { SERVINGS_PARAM, useServings } from '@/features/adjust-servings'
import { StepNavigation, progressPercent, useCookingStep } from '@/features/cook-recipe'
import { useMeasureSystem } from '@/features/measure-system'
import { StepTimer, TimerAlarm } from '@/features/step-timer'
import { BASE_SERVINGS } from '@/shared/config'
import { useTranslation } from '@/shared/i18n'
import { useWakeLock } from '@/shared/lib'
import { Card } from '@/shared/ui'
import styles from './CookingSession.module.scss'
import { CookingDone } from './CookingDone'
import { StepIngredients } from './StepIngredients'

interface CookingSessionProps {
  recipe: Recipe
}

// Tela cheia, sem cabeçalho do app: só o passo atual, em letra grande, e os
// dois botões de 64 px presos embaixo.
export function CookingSession({ recipe }: CookingSessionProps) {
  const { t } = useTranslation()
  const steps = useMemo(() => describeSteps(recipe), [recipe])
  const total = steps.length
  const [stepNumber, setStep] = useCookingStep(total)
  const [servings] = useServings()
  const system = useMeasureSystem()
  const screenOn = useWakeLock()
  const current = steps[stepNumber - 1]
  const recipeLink = `/receita/${recipe.id}${servings === BASE_SERVINGS ? '' : `?${SERVINGS_PARAM}=${servings}`}`

  return (
    <div className={styles.session}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link
            to={recipeLink}
            className={styles.back}
            aria-label={t('cooking.back')}
            title={t('cooking.back')}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </Link>
          <div className={styles.titles}>
            <h1 className={styles.title}>{t('cooking.title')}</h1>
            <p className={styles.recipeName}>{recipe.name}</p>
          </div>
          {screenOn ? (
            <span className={styles.wakeLock}>
              <Sun size={16} aria-hidden="true" />
              {t('cooking.wakeLock')}
            </span>
          ) : null}
        </div>
      </header>

      <main className={styles.main}>
        {current ? (
          <>
            <div className={styles.progressRow}>
              <p className={styles.stepCounter}>
                <span className={styles.stepCurrent}>
                  {t('cooking.step', { number: stepNumber })}
                </span>{' '}
                {t('cooking.ofTotal', { total })}
              </p>
              <span className={styles.percent}>
                {t('cooking.progress', { percent: progressPercent(stepNumber, total) })}
              </span>
            </div>
            <progress
              className={styles.progress}
              max={total}
              value={stepNumber}
              aria-label={t('cooking.progressLabel')}
            />

            {/* O texto do passo vem primeiro, à esquerda e no alto: é o que se lê de longe.
                A foto, que é a mesma em todos os passos, fica menor na coluna da direita */}
            <div className={styles.grid}>
              <div className={styles.left}>
                {/* Troca de passo é anunciada inteira: dá para ouvir a receita de longe */}
                <Card className={styles.stepCard} aria-live="polite">
                  <h2 className={styles.stepTitle}>{t('cooking.step', { number: stepNumber })}</h2>
                  <p className={styles.stepText}>
                    {highlightIngredients(current.text, current.ingredients).map(
                      (segment, index) =>
                        segment.ingredient ? (
                          <strong key={index} className={styles.mention}>
                            {segment.text}
                          </strong>
                        ) : (
                          segment.text
                        ),
                    )}
                  </p>
                </Card>
              </div>

              <div className={styles.right}>
                <img
                  className={styles.photo}
                  src={`${recipe.thumbnail}/medium`}
                  alt=""
                  width={500}
                  height={281}
                />

                {current.minutes ? (
                  <StepTimer
                    // Um componente por passo: o timer de cada um fica com o seu estado
                    key={current.number}
                    recipeId={recipe.id}
                    step={current.number}
                    minutes={current.minutes}
                  />
                ) : null}

                <StepIngredients
                  ingredients={current.ingredients}
                  servings={servings}
                  system={system}
                />

                <p className={styles.hint}>{t('cooking.keyboardHint')}</p>
              </div>
            </div>
          </>
        ) : total === 0 ? (
          <Card className={styles.empty}>
            <p>{t('cooking.noSteps')}</p>
          </Card>
        ) : (
          <CookingDone recipe={recipe} recipeLink={recipeLink} />
        )}
      </main>

      {current ? <StepNavigation step={stepNumber} total={total} onChange={setStep} /> : null}

      <TimerAlarm onGoToStep={setStep} />
    </div>
  )
}
