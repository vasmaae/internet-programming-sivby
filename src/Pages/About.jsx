import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "DISCOver - О нас";
  }, []);

  return (
    <main className="container my-5">
      <h2 className="mb-4">
        <i className="bi bi-info-circle-fill text-info"></i> О нас
      </h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card bg-secondary h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-cloud"></i> DISCOver Cloud
              </h3>
              <p className="card-text">
                Современное облачное хранилище для ваших файлов. Безопасность,
                надежность и удобство в одном месте.
              </p>
              <ul className="list-group list-group-flush bg-transparent">
                <li className="list-group-item bg-transparent text-light border-light">
                  <i className="bi bi-check-circle text-success"></i> 256-битное
                  шифрование
                </li>
                <li className="list-group-item bg-transparent text-light border-light">
                  <i className="bi bi-check-circle text-success"></i> Доступ с
                  любого устройства
                </li>
                <li className="list-group-item bg-transparent text-light border-light">
                  <i className="bi bi-check-circle text-success"></i>{" "}
                  Автоматическое резервное копирование
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
          <div className="card bg-secondary h-100">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-people"></i> Контакты
              </h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-geo-alt"></i> Россия, г. Ульяновск
                </li>
                <li className="mb-2">
                  <i className="bi bi-telephone"></i> +7 (902) 232-23-32
                </li>
                <li className="mb-2">
                  <i className="bi bi-envelope"></i> info@discover-cloud.ru
                </li>
                <li className="mt-3">
                  <a href="#" className="text-light me-2">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="text-light me-2">
                    <i className="bi bi-telegram"></i>
                  </a>
                  <a href="#" className="text-light me-2">
                    <i className="bi bi-github"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
