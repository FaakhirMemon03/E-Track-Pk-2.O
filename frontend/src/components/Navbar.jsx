import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="container">
      <Link to="/" className="logo">E-Track PK</Link>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><Link to="/login" className="btn-outline">Login</Link></li>
        <li><Link to="/signup" className="btn-primary">Get Started</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
