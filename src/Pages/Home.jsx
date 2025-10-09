import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
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
    </main>
  );
};


export default Home;
