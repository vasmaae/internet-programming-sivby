import { useState } from 'react'
import AccountsPage from './pages/AccountsPage'
import CategoriesPage from './pages/CategoriesPage'
import TransactionsPage from './pages/TransactionsPage'

const TABS = [
  { key: 'accounts', label: 'Счета' },
  { key: 'categories', label: 'Категории' },
  { key: 'transactions', label: 'Транзакции' },
]

export default function App() {
  const [tab, setTab] = useState('accounts')

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">Личный бюджет</div>
        <nav className="app-nav">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`nav-btn${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {tab === 'accounts' && <AccountsPage />}
        {tab === 'categories' && <CategoriesPage />}
        {tab === 'transactions' && <TransactionsPage />}
      </main>
    </div>
  )
}
