import { create } from 'zustand'

export interface Notice {
  /** Muda a cada aviso: dois avisos iguais seguidos ainda reiniciam o tempo na tela. */
  id: number
  tone: 'success' | 'error'
  title: string
  message: string
}

interface NoticeState {
  notice: Notice | null
  show: (notice: Omit<Notice, 'id'>) => void
  dismiss: () => void
}

let nextId = 1

// Um aviso por vez, guardado fora da árvore do React: quem avisa pode trocar de
// página logo em seguida, como o modo cozinha, que conclui e volta para o início
export const useNoticeStore = create<NoticeState>()((set) => ({
  notice: null,
  show: (notice) => set({ notice: { ...notice, id: nextId++ } }),
  dismiss: () => set({ notice: null }),
}))

/** Mostra o toast do canto superior direito, como o "Sucesso" do design system. */
export function showNotice(notice: Omit<Notice, 'id'>) {
  useNoticeStore.getState().show(notice)
}
