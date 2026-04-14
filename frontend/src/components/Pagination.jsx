export default function Pagination({ page, totalItems, pageSize, onPage, onPageSize }) {
  const totalPages = Math.ceil(totalItems / pageSize)
  if (totalItems === 0) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  const pages = buildPages(page, totalPages)

  return (
    <div className="pagination">
      <span className="pagination-info">
        {from}–{to} из {totalItems}
      </span>

      <div className="pagination-controls">
        <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
            : <button
                key={p}
                className={`page-btn${p === page ? ' active' : ''}`}
                onClick={() => onPage(p)}
              >
                {p}
              </button>
        )}

        <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
      </div>

      <select
        className="page-size-select"
        value={pageSize}
        onChange={e => { onPageSize(Number(e.target.value)); onPage(1) }}
      >
        {[5, 10, 20, 50].map(s => (
          <option key={s} value={s}>{s} / стр.</option>
        ))}
      </select>
    </div>
  )
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
