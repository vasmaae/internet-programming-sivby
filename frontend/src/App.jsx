import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import AccountsPage from './pages/AccountsPage'
import CategoriesPage from './pages/CategoriesPage'
import TransactionsPage from './pages/TransactionsPage'

const TABS = [
  { to: '/accounts', label: 'Счета' },
  { to: '/categories', label: 'Категории' },
  { to: '/transactions', label: 'Транзакции' },
]

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">Личный бюджет</div>
        <nav className="app-nav">
          {TABS.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `nav-btn${isActive ? ' active' : ''}`}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </div>
  )
}
