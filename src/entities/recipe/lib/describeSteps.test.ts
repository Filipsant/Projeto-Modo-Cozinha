import { describe, expect, it } from 'vitest'
import { describeSteps } from './describeSteps'

describe('describeSteps', () => {
  it('numera os passos e junta o tempo e os ingredientes de cada um', () => {
    const passos = describeSteps({
      steps: ['Chop the onion.', 'Fry the onion in the oil for 5 minutes.'],
      ingredients: [
        { name: 'Onion', measure: '1' },
        { name: 'Olive Oil', measure: '2 tbs' },
      ],
    })

    expect(passos).toEqual([
      {
        number: 1,
        text: 'Chop the onion.',
        minutes: null,
        ingredients: [{ name: 'Onion', measure: '1' }],
      },
      {
        number: 2,
        text: 'Fry the onion in the oil for 5 minutes.',
        minutes: 5,
        ingredients: [
          { name: 'Onion', measure: '1' },
          { name: 'Olive Oil', measure: '2 tbs' },
        ],
      },
    ])
  })
})
