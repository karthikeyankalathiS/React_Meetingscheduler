import React from 'react';

const Navbar = ({ currentPath }) => {
  return (
    <nav style={{background: "linear-gradient(89.9341deg, rgb(19, 29, 37) 0%, rgb(26, 36, 45) 100%)"}} className="navbar navbar-expand-lg navbar-dark bg-dark">
      <img  style={{ width: "30%", height: "10%" }} className="navbar-brand" src="https://www.vuedata.com/assets/vuedata%20light.png" alt="Vuedata Logo" />
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
              href="/"
            >
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${currentPath === '/booking' ? 'active' : ''}`}
              href="/booking"
            >
              Book
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

