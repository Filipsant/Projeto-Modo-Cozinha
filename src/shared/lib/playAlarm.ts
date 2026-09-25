const BEEPS = 3
const BEEP_SECONDS = 0.18
const GAP_SECONDS = 0.12

/**
 * Três bipes curtos, gerados na hora pelo Web Audio: não precisa de arquivo de
 * som. Também vibra no celular. Sem suporte a nenhum dos dois, não faz nada.
 */
export function playAlarm(): void {
  navigator.vibrate?.([200, 100, 200, 100, 200])

  if (typeof AudioContext === 'undefined') return

  try {
    const context = new AudioContext()
    const start = context.currentTime

    for (let beep = 0; beep < BEEPS; beep += 1) {
      const at = start + beep * (BEEP_SECONDS + GAP_SECONDS)
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.frequency.value = 880
      gain.gain.setValueAtTime(0.25, at)
      gain.gain.exponentialRampToValueAtTime(0.001, at + BEEP_SECONDS)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(at)
      oscillator.stop(at + BEEP_SECONDS)
    }

    // Fecha o contexto depois do último bipe, para não acumular um por alarme
    window.setTimeout(
      () => void context.close(),
      (BEEPS * (BEEP_SECONDS + GAP_SECONDS) + 0.2) * 1000,
    )
  } catch {
    // Alguns navegadores bloqueiam áudio sem um toque antes; a vibração e o aviso na tela bastam
  }
}
