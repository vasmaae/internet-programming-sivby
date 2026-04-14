import { useState, useEffect } from 'react'
import { getAccounts, getCategories, createCategory, updateCategory, deleteCategory } from '../api/api'
import Pagination from '../components/Pagination'

const EMPTY = { name: '', type: 'EXPENSE', accountId: '' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [accounts, setAccounts] = useState([])
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
    getCategories(filterAccountId || null, page - 1, pageSize)
      .then(data => { setCategories(data.content); setTotal(data.totalElements) })
      .catch(() => {})
  }, [page, pageSize, filterAccountId])

  const reload = () =>
    getCategories(filterAccountId || null, page - 1, pageSize)
      .then(data => { setCategories(data.content); setTotal(data.totalElements) })
      .catch(() => {})

  const handleFilterChange = (value) => {
    setFilterAccountId(value)
    setPage(1)
  }

  const openCreate = () => {
    setForm({ ...EMPTY, accountId: filterAccountId || (accounts[0]?.id ? String(accounts[0].id) : '') })
    setEditId(null); setError(''); setShowForm(true)
  }
  const openEdit = (c) => {
    setForm({ name: c.name, type: c.type, accountId: String(c.accountId) })
    setEditId(c.id); setError(''); setShowForm(true)
  }
  const close = () => setShowForm(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { ...form, accountId: Number(form.accountId) }
      if (editId) await updateCategory(editId, body)
      else await createCategory(body)
      close(); reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить категорию?')) return
    await deleteCategory(id).catch(() => {})
    reload()
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div>
      <div className="page-header">
        <h2>Категории</h2>
        <button className="btn-primary" onClick={openCreate} disabled={accounts.length === 0}>
          + Добавить категорию
        </button>
      </div>

      <div className="filter-bar">
        <label>Счёт:</label>
        <select value={filterAccountId} onChange={e => handleFilterChange(e.target.value)} style={{ width: 200 }}>
          <option value="">Все</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? 'Редактировать категорию' : 'Новая категория'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Название *</label>
                <input value={form.name} onChange={set('name')} required placeholder="Например: Продукты" />
              </div>
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
        {total === 0 && categories.length === 0 ? (
          <div className="empty">Категорий нет.</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Тип</th>
                  <th>Счёт</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>
                      <span className={`badge badge-${c.type === 'INCOME' ? 'income' : 'expense'}`}>
                        {c.type === 'INCOME' ? 'Доход' : 'Расход'}
                      </span>
                    </td>
                    <td>{c.accountName}</td>
                    <td>
                      <div className="actions">
                        <button className="btn-secondary btn-sm" onClick={() => openEdit(c)}>Изменить</button>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Удалить</button>
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
