import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="bg-primary py-3 shadow sticky-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand d-flex align-items-center" to="/">
              <img
                src="/images/logo.jpg"
                alt="Логотип"
                className="logo-img rounded-circle me-3"
              />
              <span>DISCOver</span>
            </NavLink>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item mx-2">
                  <NavLink className="nav-link" to="/">
                    <i className="bi bi-house-door me-1"></i> Главная
                  </NavLink>
                </li>

                <li className="nav-item dropdown mx-2">
                  <button
                    className="nav-link dropdown-toggle btn btn-link border-0"
                    type="button"
                    id="filesDropdown"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-folder me-1"></i> Файлы
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <NavLink className="dropdown-item" to="/my-files">
                        <i className="bi bi-files me-2"></i>Мои файлы
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/starred">
                        <i className="bi bi-star me-2"></i>Избранное
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/basket">
                        <i className="bi bi-trash me-2"></i>Корзина
                      </NavLink>
                    </li>
                  </ul>
                </li>

                <li className="nav-item mx-2">
                  <NavLink className="nav-link" to="/about">
                    <i className="bi bi-info-circle me-1"></i> О нас
                  </NavLink>
                </li>
              </ul>

              <div className="d-flex">
                <div className="input-group me-3 d-none d-lg-flex">
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-light" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>

                <div className="dropdown">
                  <button
                    type="button"
                    className="nav-link dropdown-toggle btn btn-link border-0"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle fs-5"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li>
                      <h6 className="dropdown-header">Аккаунт</h6>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bi bi-person me-2"></i>Профиль
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="bi bi-gear me-2"></i>Настройки
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item text-danger" href="#">
                        <i className="bi bi-box-arrow-right me-2"></i>Выйти
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
