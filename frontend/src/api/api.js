const BASE = 'http://localhost:8080/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || JSON.stringify(data))
  return data
}

// Accounts
export const getAccounts = (page = 0, size = 10) =>
  request(`/accounts?page=${page}&size=${size}`)
export const createAccount = (body) => request('/accounts', { method: 'POST', body: JSON.stringify(body) })
export const updateAccount = (id, body) => request(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteAccount = (id) => request(`/accounts/${id}`, { method: 'DELETE' })

// Categories
export const getCategories = (accountId, page = 0, size = 10) => {
  const params = new URLSearchParams({ page, size })
  if (accountId) params.set('accountId', accountId)
  return request(`/categories?${params}`)
}
export const createCategory = (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) })
export const updateCategory = (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteCategory = (id) => request(`/categories/${id}`, { method: 'DELETE' })

// Transactions
export const getTransactions = (accountId, page = 0, size = 10) => {
  const params = new URLSearchParams({ page, size })
  if (accountId) params.set('accountId', accountId)
  return request(`/transactions?${params}`)
}
export const createTransaction = (body) => request('/transactions', { method: 'POST', body: JSON.stringify(body) })
export const updateTransaction = (id, body) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteTransaction = (id) => request(`/transactions/${id}`, { method: 'DELETE' })
