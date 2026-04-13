import React from "react";

const Pagination = ({ pageData, page, setPage }) => {
  if (pageData.totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
      <span className="text-muted">
        Страница {page + 1} из {pageData.totalPages}
      </span>

      <div className="btn-group">
        <button
          className="btn btn-outline-light"
          onClick={() => setPage(page - 1)}
          disabled={pageData.first}
        >
          Назад
        </button>
        <button
          className="btn btn-outline-light"
          onClick={() => setPage(page + 1)}
          disabled={pageData.last}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default Pagination;
