import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary py-4 mt-auto">
      <div className="container text-center">
        <p>&copy; 2025 DISCOver Cloud Storage. Все права защищены.</p>
        <div className="social-icons mt-3">
          <a href="#" className="text-light mx-2">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="text-light mx-2">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#" className="text-light mx-2">
            <i className="bi bi-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
