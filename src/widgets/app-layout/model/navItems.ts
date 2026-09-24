export interface NavItem {
  to: string
  label: string
  icon: string
  /** Só a raiz precisa de correspondência exata, senão ela fica sempre ativa. */
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', icon: '🏠', end: true },
  { to: '/favoritos', label: 'Favoritos', icon: '♥' },
  { to: '/lista-de-compras', label: 'Lista de compras', icon: '🧾' },
]
