import { useTranslation } from '@/shared/i18n'
import { useOnlineStatus } from '@/shared/lib'
import styles from './ConnectionStatus.module.scss'

/** O "● Online" do design; fica laranja quando a internet cai. */
export function ConnectionStatus() {
  const { t } = useTranslation()
  const online = useOnlineStatus()

  return (
    <span className={online ? styles.status : `${styles.status} ${styles.offline}`}>
      <span className={styles.dot} aria-hidden="true" />
      {online ? t('connection.online') : t('connection.offline')}
    </span>
  )
}

/** Faixa embaixo do cabeçalho enquanto não há internet: diz o que continua funcionando. */
export function OfflineBanner() {
  const { t } = useTranslation()
  const online = useOnlineStatus()

  return (
    // O status fica sempre na página, vazio quando online: assim a queda é anunciada
    <p className={online ? styles.bannerHidden : styles.banner} role="status">
      {online ? '' : t('connection.offlineBanner')}
    </p>
  )
}
