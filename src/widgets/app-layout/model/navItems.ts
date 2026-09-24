export interface NavItem {
  to: string
  /** Chave de tradução: o texto visível sai do dicionário, não daqui. */
  labelKey: 'nav.home' | 'nav.favorites' | 'nav.shoppingList'
  icon: string
  /** Só a raiz precisa de correspondência exata, senão ela fica sempre ativa. */
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: '🏠', end: true },
  { to: '/favoritos', labelKey: 'nav.favorites', icon: '♥' },
  { to: '/lista-de-compras', labelKey: 'nav.shoppingList', icon: '🧾' },
]
