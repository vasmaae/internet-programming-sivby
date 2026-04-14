import { useState, useEffect } from 'react'
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../api/api'

const EMPTY = { name: '', balance: '', currency: 'RUB' }

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = () => getAccounts().then(setAccounts).catch(() => {})

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setShowForm(true) }
  const openEdit = (a) => {
    setForm({ name: a.name, balance: String(a.balance), currency: a.currency })
    setEditId(a.id); setError(''); setShowForm(true)
  }
  const close = () => setShowForm(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { ...form, balance: parseFloat(form.balance) }
      if (editId) await updateAccount(editId, body)
      else await createAccount(body)
      close(); load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить счёт? Все категории и транзакции счёта также будут удалены.')) return
    await deleteAccount(id).catch(() => {})
    load()
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div>
      <div className="page-header">
        <h2>Счета</h2>
        <button className="btn-primary" onClick={openCreate}>+ Добавить счёт</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? 'Редактировать счёт' : 'Новый счёт'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Название *</label>
                <input value={form.name} onChange={set('name')} required placeholder="Например: Основная карта" />
              </div>
              <div className="form-field">
                <label>{editId ? 'Баланс' : 'Начальный баланс *'}</label>
                <input type="number" step="0.01" value={form.balance} onChange={set('balance')} required placeholder="0.00" disabled={!!editId} />
                {editId && <small style={{ color: '#999' }}>Баланс изменяется через транзакции</small>}
              </div>
              <div className="form-field">
                <label>Валюта *</label>
                <input value={form.currency} onChange={set('currency')} required maxLength={3} placeholder="RUB" />
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={close}>Отмена</button>
                <button type="submit" className="btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        {accounts.length === 0 ? (
          <div className="empty">Счетов нет. Добавьте первый счёт.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Баланс</th>
                <th>Валюта</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>
                    <span className={a.balance >= 0 ? 'amount-income' : 'amount-expense'}>
                      {Number(a.balance).toFixed(2)}
                    </span>
                  </td>
                  <td>{a.currency}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-secondary btn-sm" onClick={() => openEdit(a)}>Изменить</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
