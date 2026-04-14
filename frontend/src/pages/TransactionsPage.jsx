import { useState, useEffect } from 'react'
import { getAccounts, getCategories, getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/api'
import Pagination from '../components/Pagination'

const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = { amount: '', description: '', date: today(), type: 'EXPENSE', accountId: '', categoryId: '' }

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [filterAccountId, setFilterAccountId] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    getAccounts(0, 1000).then(data => {
      setAccounts(data.content)
      if (data.content.length > 0) setFilterAccountId(String(data.content[0].id))
    })
  }, [])

  useEffect(() => {
    getTransactions(filterAccountId || null, page - 1, pageSize)
      .then(data => { setTransactions(data.content); setTotal(data.totalElements) })
      .catch(() => {})
  }, [page, pageSize, filterAccountId])

  useEffect(() => {
    if (form.accountId) {
      getCategories(form.accountId, 0, 1000).then(data =>
        setCategories(data.content.filter(c => c.type === form.type))
      )
    } else {
      setCategories([])
    }
  }, [form.accountId, form.type])

  const reload = () =>
    getTransactions(filterAccountId || null, page - 1, pageSize)
      .then(data => { setTransactions(data.content); setTotal(data.totalElements) })
      .catch(() => {})

  const handleFilterChange = (value) => {
    setFilterAccountId(value)
    setPage(1)
  }

  const openCreate = () => {
    const defaultAccount = filterAccountId || (accounts[0]?.id ? String(accounts[0].id) : '')
    setForm({ ...EMPTY, date: today(), accountId: defaultAccount })
    setEditId(null); setError(''); setShowForm(true)
  }

  const openEdit = (t) => {
    setForm({
      amount: String(t.amount),
      description: t.description || '',
      date: t.date,
      type: t.type,
      accountId: String(t.accountId),
      categoryId: t.categoryId ? String(t.categoryId) : '',
    })
    setEditId(t.id); setError(''); setShowForm(true)
  }

  const close = () => setShowForm(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = {
        amount: parseFloat(form.amount),
        description: form.description || null,
        date: form.date,
        type: form.type,
        accountId: Number(form.accountId),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      }
      if (editId) await updateTransaction(editId, body)
      else await createTransaction(body)
      close(); reload()
      getAccounts(0, 1000).then(data => setAccounts(data.content))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить транзакцию?')) return
    await deleteTransaction(id).catch(() => {})
    reload()
    getAccounts(0, 1000).then(data => setAccounts(data.content))
  }

  const set = (field) => (e) => {
    const val = e.target.value
    setForm(f => {
      const next = { ...f, [field]: val }
      if (field === 'type' || field === 'accountId') next.categoryId = ''
      return next
    })
  }

  const formatAmount = (t) => {
    const sign = t.type === 'INCOME' ? '+' : '−'
    return (
      <span className={t.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
        {sign}{Number(t.amount).toFixed(2)}
      </span>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h2>Транзакции</h2>
        <button className="btn-primary" onClick={openCreate} disabled={accounts.length === 0}>
          + Добавить транзакцию
        </button>
      </div>

      <div className="filter-bar">
        <label>Счёт:</label>
        <select value={filterAccountId} onChange={e => handleFilterChange(e.target.value)} style={{ width: 200 }}>
          <option value="">Все</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name} ({Number(a.balance).toFixed(2)} {a.currency})</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? 'Редактировать транзакцию' : 'Новая транзакция'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Тип *</label>
                <select value={form.type} onChange={set('type')}>
                  <option value="EXPENSE">Расход</option>
                  <option value="INCOME">Доход</option>
                </select>
              </div>
              <div className="form-field">
                <label>Счёт *</label>
                <select value={form.accountId} onChange={set('accountId')} required>
                  <option value="">— выберите —</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Сумма *</label>
                <input type="number" step="0.01" min="0.01" value={form.amount} onChange={set('amount')} required placeholder="0.00" />
              </div>
              <div className="form-field">
                <label>Дата *</label>
                <input type="date" value={form.date} onChange={set('date')} required />
              </div>
              <div className="form-field">
                <label>Категория</label>
                <select value={form.categoryId} onChange={set('categoryId')} disabled={!form.accountId}>
                  <option value="">— без категории —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Описание</label>
                <input value={form.description} onChange={set('description')} placeholder="Необязательно" />
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
        {total === 0 && transactions.length === 0 ? (
          <div className="empty">Транзакций нет.</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Тип</th>
                  <th>Категория</th>
                  <th>Описание</th>
                  <th>Счёт</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td>{formatAmount(t)}</td>
                    <td>
                      <span className={`badge badge-${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                        {t.type === 'INCOME' ? 'Доход' : 'Расход'}
                      </span>
                    </td>
                    <td>{t.categoryName || <span style={{ color: '#aaa' }}>—</span>}</td>
                    <td>{t.description || <span style={{ color: '#aaa' }}>—</span>}</td>
                    <td>{t.accountName}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-secondary btn-sm" onClick={() => openEdit(t)}>Изменить</button>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={page}
              totalItems={total}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={(s) => { setPageSize(s); setPage(1) }}
            />
          </>
        )}
      </div>
    </div>
  )
}
