import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useReport } from "../hooks/useReport";
import { formatBytes } from "../utils/format";

const Home = () => {
  const { report, loading } = useReport();

  useEffect(() => {
    document.title = "DISCOver - Главная";
  }, []);

  return (
    <main className="container my-5">
      <section className="text-center py-5">
        <h2 className="mb-4">
          <i className="bi bi-cloud-arrow-up"></i> Добро пожаловать в DISCOver!
        </h2>
        <img
          src="/images/logo.jpg"
          alt="Логотип"
          className="main-logo img-thumbnail my-4"
        />
        <p className="lead">
          Ваше надежное облачное хранилище для всех типов файлов
        </p>
        <Link to="/my-files" className="btn btn-primary btn-lg mt-3">
          <i className="bi bi-folder-plus"></i> Начать работу
        </Link>
      </section>

      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Статистика по папкам</h3>
          <span className="text-muted">Отчет Spring Data + aggregation</span>
        </div>

        <div className="card bg-secondary border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Папка</th>
                    <th>Владелец</th>
                    <th>Файлов</th>
                    <th>Активный объем</th>
                    <th>Общий объем</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading &&
                    report.map((item) => (
                      <tr key={item.folderId}>
                        <td>{item.folderName}</td>
                        <td>{item.ownerUsername}</td>
                        <td>{item.fileCount}</td>
                        <td>{formatBytes(item.activeBytes)}</td>
                        <td>{formatBytes(item.totalBytes)}</td>
                      </tr>
                    ))}
                  {loading && (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Загрузка отчета...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
